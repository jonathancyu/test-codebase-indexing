#!/usr/bin/env python3
"""Port forwarding script for connecting to RDS/Aurora databases through SSM."""

import os
import sys
import time
import logging
import signal
import socket
import subprocess
from pathlib import Path

# Configure logging
logging.basicConfig(level=os.environ.get('DEBUG_LEVEL', 'INFO'))
logger = logging.getLogger(__name__)

try:
    from service_connections.database.aurora import AuroraConnection
except ImportError:
    logger.error("service_connections package not found. Please install it with: pip install service_connections")
    sys.exit(1)

def is_port_in_use(port, host='127.0.0.1'):
    """Check if a port is in use on the specified host"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex((host, port)) == 0

def wait_for_port(host, port, timeout=30):
    """Wait for a port to be available"""
    logger.debug(f"Waiting for port {port} on {host}")
    start_time = time.time()
    while time.time() - start_time < timeout:
        if is_port_in_use(port, host):
            return True
        time.sleep(1)
    return False

class PortForwarder:
    def __init__(self):
        self.aurora = AuroraConnection()
        self.ssm_process = None
        self.socat_process = None
        self.should_exit = False
        signal.signal(signal.SIGTERM, self.handle_sigterm)
        signal.signal(signal.SIGINT, self.handle_sigterm)

    def handle_sigterm(self, signum, frame):
        logger.info("Shutting down port forwarder")
        self.should_exit = True
        if self.ssm_process:
            logger.debug("Terminating SSM process")
            try:
                self.ssm_process.terminate()
                self.ssm_process.wait()
            except:
                pass
        if self.socat_process:
            logger.debug("Terminating socat process")
            try:
                self.socat_process.terminate()
                self.socat_process.wait()
            except:
                pass
        self.aurora.stop_port_forward()
        sys.exit(0)

    def start_port_forward(self):
        try:
            # Clean up before starting
            logger.debug("Cleaning up existing processes")
            try:
                subprocess.run("pkill -f socat || true", shell=True)
                subprocess.run("lsof -ti:5432 | xargs kill -9 2>/dev/null || true", shell=True)
                subprocess.run("lsof -ti:15433 | xargs kill -9 2>/dev/null || true", shell=True)
                time.sleep(1)
            except Exception as e:
                logger.warning(f"Error during cleanup: {e}")
                
            stack_name = os.environ.get("STACK_NAME", "prd-intelligence-infra-dev")
            region = os.environ.get("AWS_REGION", "us-west-2")
            
            logger.info(f"Setting up port forwarding for stack {stack_name}")
            
            # Get connection details from the service_connections library
            try:
                endpoint, ec2_id, _ = self.aurora.get_connection_details(stack_name, region=region)
                logger.debug(f"Retrieved endpoint: {endpoint}")
                
            except Exception as e:
                logger.error(f"Error getting connection details: {e}")
                return False
            
            # Start SSM session with port forwarding to a temporary local port
            tmp_port = 15433  # Use a different port temporarily
            cmd = [
                "aws", "ssm", "start-session",
                "--target", ec2_id,
                "--document-name", "AWS-StartPortForwardingSessionToRemoteHost",
                "--parameters", f"host={endpoint},portNumber=5432,localPortNumber={tmp_port}",
                "--region", region
            ]
            
            logger.debug(f"Starting SSM port forwarding to {endpoint}")
            self.ssm_process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                universal_newlines=True
            )
            
            # Check for immediate startup errors
            time.sleep(1)
            if self.ssm_process.poll() is not None:
                stdout, stderr = self.ssm_process.communicate()
                logger.error(f"SSM process failed to start: {stderr}")
                return False
                
            # Wait for temporary port to be ready
            logger.debug(f"Waiting for port {tmp_port}")
            if not wait_for_port('127.0.0.1', tmp_port, timeout=60):
                logger.error(f"Port {tmp_port} never became ready")
                return False
            logger.debug(f"Port {tmp_port} is ready")
            
            # Start socat to expose the port to all interfaces
            socat_cmd = f"socat TCP-LISTEN:5432,bind=0.0.0.0,reuseaddr,fork TCP:127.0.0.1:{tmp_port}"
            logger.debug("Starting socat to expose port 5432")
            self.socat_process = subprocess.Popen(
                socat_cmd,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            # Check if socat started successfully
            time.sleep(2)
            if self.socat_process.poll() is not None:
                stderr = self.socat_process.stderr.read().decode('utf-8')
                logger.error(f"Socat process failed to start: {stderr}")
                return False
            
            # Test the connection
            logger.debug("Testing connection to port 5432")
            if wait_for_port('0.0.0.0', 5432, timeout=10):
                logger.info("Port forwarding established successfully")
                
                # Create a success marker file for health check
                Path('/tmp/port_forward_success').touch()
                logger.debug("Created success marker file")
                
                # Keep the process running until terminated
                while not self.should_exit:
                    time.sleep(5)
                    
                    # Check if SSM process is still running
                    if self.ssm_process.poll() is not None:
                        logger.warning("SSM process terminated, restarting")
                        try:
                            self.ssm_process.terminate()
                        except:
                            pass
                            
                        self.ssm_process = subprocess.Popen(
                            cmd,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            universal_newlines=True
                        )
                        
                        if not wait_for_port('127.0.0.1', tmp_port, timeout=30):
                            logger.error("Failed to restart SSM process")
                            return False
                        logger.debug("SSM process restarted")
                    
                    # Check if socat is still running
                    if self.socat_process.poll() is not None:
                        logger.warning("Socat process terminated, restarting")
                        socat_cmd = f"socat TCP-LISTEN:5432,bind=0.0.0.0,reuseaddr,fork TCP:127.0.0.1:{tmp_port}"
                        self.socat_process = subprocess.Popen(
                            socat_cmd,
                            shell=True,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE
                        )
                        logger.debug("Socat process restarted")
                        
                    # Verify connection is still working
                    if not is_port_in_use(5432, '0.0.0.0'):
                        logger.warning("Lost connection to port 5432, restarting socat")
                        try:
                            self.socat_process.terminate()
                        except:
                            pass
                            
                        socat_cmd = f"socat TCP-LISTEN:5432,bind=0.0.0.0,reuseaddr,fork TCP:127.0.0.1:{tmp_port}"
                        self.socat_process = subprocess.Popen(
                            socat_cmd,
                            shell=True,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE
                        )
                        logger.debug("Socat process restarted after connection loss")
                
                return True
            else:
                logger.error("Could not connect to forwarded port 5432")
                return False
            
        except Exception as e:
            logger.error(f"Error in port forwarding: {e}")
            if self.ssm_process:
                try:
                    self.ssm_process.terminate()
                except:
                    pass
            if self.socat_process:
                try:
                    self.socat_process.terminate()
                except:
                    pass
            return False

    def run(self):
        # Retry loop
        retry_count = 0
        max_retries = 5
        
        while retry_count < max_retries and not self.should_exit:
            try:
                success = self.start_port_forward()
                if success:
                    return 0
            except Exception as e:
                logger.error(f"Attempt {retry_count + 1} failed: {e}")
                
            retry_count += 1
            logger.info(f"Retrying port forwarding (attempt {retry_count + 1}/{max_retries})")
            time.sleep(10)
        
        logger.error(f"Failed to establish port forwarding after {max_retries} attempts")
        return 1

if __name__ == "__main__":
    forwarder = PortForwarder()
    sys.exit(forwarder.run()) 