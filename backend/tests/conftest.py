# add paths for backend_code imports
import sys
import os

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # backend/
project_root = os.path.dirname(backend_dir)  # project root
print(backend_dir)
print(project_root)
sys.path.append(backend_dir)
sys.path.append(project_root)

# for all tests go get the environment variables to use
from test_config import load_test_environment

try:
    load_test_environment()
except Exception as e:
    print(f"Error loading test environment: {e}")
