#!/bin/bash
set -e

# Parse command line arguments for AWS profile and environment
while getopts "p:e:" opt; do
  case $opt in
    p) AWS_PROFILE="$OPTARG";;
    e) ENVIRONMENT="$OPTARG";;
    \?) echo "Invalid option -$OPTARG" >&2;;
  esac
done

# Check if environment is provided
if [ -z "$ENVIRONMENT" ]; then
  echo "Error: Environment (-e) is required"
  echo "Usage: $0 -e <environment> [-p <aws-profile>]"
  echo "Valid environments: dev, stage, prod"
  exit 1
fi

# Validate environment
case "$ENVIRONMENT" in
  dev|stage|prod)
    ;;
  *)
    echo "Error: Invalid environment '$ENVIRONMENT'"
    echo "Valid environments: dev, stage, prod"
    exit 1
    ;;
esac

# Export AWS_PROFILE if it was provided
if [ ! -z "$AWS_PROFILE" ]; then
  export AWS_PROFILE
  echo "Using AWS Profile: $AWS_PROFILE"
fi

# Get CodeArtifact token
export CODEARTIFACT_AUTH_TOKEN=$(aws codeartifact get-authorization-token --domain packages --domain-owner 982534352120 --query authorizationToken --output text)

# Create pip config directory if it doesn't exist
mkdir -p ~/.pip

# Create or update pip.conf
cat > ~/.pip/pip.conf << EOF
[global]
extra-index-url = https://aws:${CODEARTIFACT_AUTH_TOKEN}@packages-982534352120.d.codeartifact.us-west-2.amazonaws.com/pypi/pypi-store/simple/
EOF
echo "✅ CodeArtifact authentication configured successfully!"

# Install environment_variable_manager if not already installed
if ! pip show environment_variable_manager &>/dev/null; then
  echo "Installing environment_variable_manager..."
  pip install environment_variable_manager
fi

# Load environment variables from JSON file if secret exists
echo "Checking for secret PROJECT_NAME_PLACEHOLDER-infra-${ENVIRONMENT}-EnvironmentVariables..."
if aws secretsmanager describe-secret --secret-id PROJECT_NAME_PLACEHOLDER-infra-${ENVIRONMENT}-EnvironmentVariables >/dev/null 2>&1; then
    echo "Loading environment variables from secret PROJECT_NAME_PLACEHOLDER-infra-${ENVIRONMENT}-EnvironmentVariables..."
    env-manager get --secret-name PROJECT_NAME_PLACEHOLDER-infra-${ENVIRONMENT}-EnvironmentVariables --output environment-variables.json
    eval "$(jq -r 'to_entries | .[] | select(.key != null and .key != "") | "export " + (.key | @sh) + "=" + (.value | @sh)' environment-variables.json)"
    rm environment-variables.json
else
    echo "Secret PROJECT_NAME_PLACEHOLDER-infra-${ENVIRONMENT}-EnvironmentVariables not found, continuing without environment variables..."
fi

# deploy the aws cdk stack
cd cdk

# Install dependencies
pnpm install

# Check if CDK toolkit stack exists
echo "Checking if account is CDK bootstrapped..."
if ! aws cloudformation describe-stacks --stack-name CDKToolkit >/dev/null 2>&1; then
    echo "CDK toolkit stack does not exist. Bootstrapping account..."
    cdk bootstrap
else
    echo "CDK toolkit stack exists. Continuing without bootstrapping..."
fi

# deploy the cdk stack
pnpm run deploy:${ENVIRONMENT}

echo "Deployment completed successfully!"
