import os
import boto3
from environment_variable_manager.core.secrets_manager import set_env_vars_from_aws

environment = os.environ.get("ENVIRONMENT", "dev")


def load_test_environment():
    """Load all required environment variables and stack outputs for testing"""
    region_name = "us-west-2"
    session = boto3.session.Session()

    # Load secrets from AWS Secrets Manager
    os.environ["ENVIRONMENT_VARIABLES_SECRET_NAME"] = (
        f"PROJECT_NAME_PLACEHOLDER-infra-{environment}-EnvironmentVariables"
    )
    env_vars = set_env_vars_from_aws(secret_name=os.environ["ENVIRONMENT_VARIABLES_SECRET_NAME"])
    env_vars["ENVIRONMENT_VARIABLES_SECRET_NAME"] = os.environ[
        "ENVIRONMENT_VARIABLES_SECRET_NAME"
    ]  # set this so it is returned in the env_vars dict

    # Load CloudFormation outputs
    cdk_env_vars = _load_stack_outputs(session, region_name)

    # Set the proxy endpoint to localhost:5432 which will be opened before the test
    os.environ["PROXY_ENDPOINT"] = "localhost:5432"

    return {
        **env_vars,
        **cdk_env_vars,
        "PROXY_ENDPOINT": os.environ["PROXY_ENDPOINT"],
        "ENVIRONMENT": environment,
    }


def _load_stack_outputs(session, region_name):
    """Load outputs from CloudFormation stacks"""
    cfn_client = session.client("cloudformation", region_name=region_name)

    # Load stack outputs
    project_stack = cfn_client.describe_stacks(StackName=f"PROJECT_NAME_PLACEHOLDER-infra-{environment}")[
        "Stacks"
    ][0]
    project_stack_outputs = project_stack.get("Outputs", [])

    # Get API URL
    api_url = next(
        output["OutputValue"]
        for output in project_stack_outputs
        if output["OutputKey"].endswith("apiendpoint")
    ).rstrip("/")

    # Set environment variables from the stack outputs
    if os.environ.get("LOCAL_API_TEST", "true") == "true":
        os.environ["API_URL"] = "http://0.0.0.0:8000/v1"
    else:
        os.environ["API_URL"] = api_url

    return {
        "API_URL": os.environ["API_URL"],
    }
