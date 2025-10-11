#!/bin/bash
set -e

# --------------------------- Step 0: Warning Banner ---------------------------

echo -e "\033[1;31m
   ▄█     █▄     ▄████████    ▄████████  ███▄▄▄▄     ▄█  ███▄▄▄▄      ▄██████▄  
  ███     ███   ███    ███   ███    ███  ███▀▀▀██▄  ███  ███▀▀▀██▄   ███    ███ 
  ███     ███   ███    ███   ███    ███  ███   ███  ███▌ ███   ███   ███    █▀  
  ███     ███   ███    ███  ▄███▄▄▄▄██▀  ███   ███  ███▌ ███   ███  ▄███        
  ███     ███ ▀███████████  ▀██████████  ███   ███  ███▌ ███   ███ ▀▀███ ████▄  
  ███     ███   ███    ███   ███    ███  ███   ███  ███  ███   ███   ███    ███ 
  ███ ▄█▄ ███   ███    ███   ███    ███  ███   ███  ███  ███   ███   ███    ███ 
   ▀███▀███▀    ███    █▀    ███    ███   ▀█   █▀   █▀    ▀█   █▀    ████████▀  
\033[0m"

echo -e "\033[1;33m⚠️  ⚠️  ⚠️  ⚠️  ⚠️  ⚠️  ⚠️  ⚠️  WARNING  ⚠️  ⚠️  ⚠️  ⚠️  ⚠️  ⚠️  ⚠️  ⚠️\033[0m"
echo ""
echo -e "\033[1;31m🚨 THIS SCRIPT WILL SERIOUSLY MESS WITH A REPO'S CICD SETUP AND/OR YOUR LOCAL WORK IN GIT 🚨\033[0m"
echo -e "\033[1;37m❌ DO NOT RUN THIS SCRIPT IF YOU ARE NOT SURE WHAT IT DOES\033[0m"
echo -e "\033[1;37m❌ DO NOT RUN THIS SCRIPT IN AN EXISTING PRODUCTION REPO\033[0m"
echo ""
echo -e "\033[1;36mPlease contact for assistance:\033[0m"
echo -e "\033[1;37m  • clay@8090.inc\033[0m"
echo -e "\033[1;37m  • chris@8090.inc\033[0m"
echo -e "\033[1;37m  • court@8090.inc\033[0m"
echo ""
echo -e "\033[1;33m📝 This script will modify your repository's:\033[0m"
echo -e "\033[1;37m  ▸ Git branches (develop, stage, releases)\033[0m"
echo -e "\033[1;37m  ▸ GitHub environments (prod, stage, develop)\033[0m"
echo -e "\033[1;37m  ▸ AWS CloudFormation stacks for OIDC authentication\033[0m"
echo -e "\033[1;37m  ▸ GitHub environment variables\033[0m"
echo ""
echo -e "\033[1;33m⚡ Requirements:\033[0m"
echo -e "\033[1;37m  1. GitHub admin permissions on the repo\033[0m"
echo -e "\033[1;37m  2. AWS credentials with admin access for provided profiles (-d, -s, -p)\033[0m"
echo ""
echo -e "\033[1;33m"
read -p "🤔 Do you want to continue? (y/N) " -n 1 -r
echo -e "\033[0m"
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\033[1;31m❌ Operation cancelled\033[0m"
    exit 1
fi

# --------------------------- Step 1: Create branches in the repo ---------------------------

# Function to check if branch exists in remote
check_remote_branch() {
    git ls-remote --heads origin $1 | grep -q $1
    return $?
}

# Create branches only if they don't exist in remote
original_branch=$(git branch --show-current)
for branch in "develop" "stage" "release/0.0.0"; do
    if ! check_remote_branch $branch; then
        echo "Creating branch: $branch"
        git checkout main
        git checkout -b $branch
        git push --set-upstream origin $branch
    else
        echo "Branch $branch already exists in remote. Skipping creation."
    fi
done
git checkout $original_branch

# --------------------------- Step 2: Create environments in Github ---------------------------

# Function to create GitHub environment if it doesn't exist
create_github_environment() {
    local env_name=$1
    local branch_name=$2
    local repo_name=$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/' | sed 's/https:\/\/github.com\///')
    echo "Repo name: ${repo_name}"
    
    # Create/update the environment with branch policy
    echo "Creating/updating environment: $env_name with branch policy for ${branch_name}"
    gh api \
        --method PUT \
        --silent \
        "repos/${repo_name}/environments/${env_name}" \
        -F deployment_branch_policy[protected_branches]=false \
        -F deployment_branch_policy[custom_branch_policies]=true

    # Now create the branch policy
    gh api \
        --method POST \
        --silent \
        "repos/${repo_name}/environments/${env_name}/deployment-branch-policies" \
        -f name="${branch_name}"

    # If this is the develop environment, add the release/* pattern
    if [ "$env_name" = "develop" ]; then
        echo "Adding release/* branch policy for develop environment"
        gh api \
            --method POST \
            --silent \
            "repos/${repo_name}/environments/${env_name}/deployment-branch-policies" \
            -f name="release/*"
    fi
}

# Ensure GitHub CLI is installed and authenticated
if ! command -v gh &>/dev/null; then
    echo "❌ERROR❌ GitHub CLI (gh) is not installed. Please install it first."
    exit 1
fi

# Create environments with their corresponding branches
create_github_environment "prod" "main"
create_github_environment "stage" "stage"
create_github_environment "develop" "develop"

# --------------------------- Step 3: Deploy AWS Cfn for role which will deploy the CDK ---------------------------

# Get repository name from git config
REPO_NAME=$(basename -s .git $(git config --get remote.origin.url))
echo "Repo name: ${REPO_NAME}"

# Get AWS profiles from arguments, default to 'default' if not provided
while getopts "d:s:p:" opt; do
  case $opt in
    d) AWS_PROFILE_DEV="$OPTARG" ;;
    s) AWS_PROFILE_STAGE="$OPTARG" ;;
    p) AWS_PROFILE_PROD="$OPTARG" ;;
    *) ;;
  esac
done

# Set stack name for OIDC role
STACK_NAME_BASE="github-${REPO_NAME}-oidc-role"

# Replace associative array with separate environment and profile arrays
declare -a env_names=()
declare -a env_profiles=()

# Add environments where profiles were provided via arguments
if [ -n "$AWS_PROFILE_DEV" ]; then
    env_names+=("develop")
    env_profiles+=("$AWS_PROFILE_DEV")
fi
if [ -n "$AWS_PROFILE_STAGE" ]; then
    env_names+=("stage")
    env_profiles+=("$AWS_PROFILE_STAGE")
fi
if [ -n "$AWS_PROFILE_PROD" ]; then
    env_names+=("prod")
    env_profiles+=("$AWS_PROFILE_PROD")
fi

# Check if we have any environments to process
if [ ${#env_names[@]} -eq 0 ]; then
    echo "❌ERROR❌ No AWS profiles provided via arguments."
    echo "Usage: $0 -d dev_profile -s stage_profile -p prod_profile"
    echo "At least one profile must be specified."
    exit 1
fi

echo "Starting CloudFormation deployments..."
echo "Repository name: ${REPO_NAME}"
echo "----------------------------------------"

# Loop through environments using index
for i in "${!env_names[@]}"; do
    env="${env_names[$i]}"
    profile="${env_profiles[$i]}"
    
    # Get AWS account ID for the current profile
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --profile ${profile} --query Account --output text)
    
    # Use environment-specific stack name
    STACK_NAME="${STACK_NAME_BASE}-${env}"
    
    echo "Environment: ${env}"
    echo "AWS Profile: ${profile}"
    echo "AWS Account: ${AWS_ACCOUNT_ID}"
    echo "Stack name: ${STACK_NAME}"
    
    # Check for existing GitHub OIDC provider
    echo "Checking for existing GitHub OIDC provider..."
    GITHUB_OIDC_ARN=$(aws iam list-open-id-connect-providers --profile ${profile} | grep -o "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com" || true)
    
    # Prepare parameters
    PARAMS="GitHubRepo=${REPO_NAME} GitHubStage=${env}"
    if [ ! -z "$GITHUB_OIDC_ARN" ]; then
        echo "Using existing OIDC provider: ${GITHUB_OIDC_ARN}"
        PARAMS="${PARAMS} ExistingOIDCProvider=${GITHUB_OIDC_ARN}"
    else
        echo "No existing OIDC provider found. Will create new one."
    fi
    
    echo "Checking if stack exists..."
    if aws cloudformation describe-stacks --stack-name "${STACK_NAME}" --profile ${profile} &>/dev/null; then
        echo "Stack exists, updating..."
        UPDATE_OUTPUT=$(aws cloudformation update-stack \
            --template-body "file://github-oidc-iam-role.yml" \
            --stack-name "${STACK_NAME}" \
            --parameters ParameterKey=GitHubRepo,ParameterValue=${REPO_NAME} \
                        ParameterKey=GitHubStage,ParameterValue=${env} \
                        ${GITHUB_OIDC_ARN:+"ParameterKey=ExistingOIDCProvider,ParameterValue=${GITHUB_OIDC_ARN}"} \
            --capabilities CAPABILITY_NAMED_IAM \
            --profile ${profile} 2>&1)
        UPDATE_STATUS=$?
        
        if echo "$UPDATE_OUTPUT" | grep -q "No updates are to be performed"; then
            echo "✅ No updates needed for ${env} environment"
        elif [ $UPDATE_STATUS -eq 0 ]; then
            echo "Waiting for stack update to complete..."
            aws cloudformation wait stack-update-complete \
                --stack-name "${STACK_NAME}" \
                --profile ${profile}
            echo "✅ Successfully updated stack for ${env} environment"
        else
            echo "❌ERROR❌ Failed to update stack for ${env} environment"
            echo "Error details: $UPDATE_OUTPUT"
            exit 1
        fi
    else
        echo "Stack doesn't exist, creating new stack..."
        CREATE_OUTPUT=$(aws cloudformation deploy \
            --template-file github-oidc-iam-role.yml \
            --stack-name "${STACK_NAME}" \
            --parameter-overrides ${PARAMS} \
            --capabilities CAPABILITY_NAMED_IAM \
            --profile ${profile} 2>&1)
        CREATE_STATUS=$?
        
        if [ $CREATE_STATUS -eq 0 ]; then
            echo "Waiting for stack creation to complete..."
            aws cloudformation wait stack-create-complete \
                --stack-name "${STACK_NAME}" \
                --profile ${profile}
            echo "✅ Successfully deployed new stack for ${env} environment"
        else
            echo "❌ERROR❌ Failed to deploy stack for ${env} environment"
            echo "Error details: $CREATE_OUTPUT"
            exit 1
        fi
    fi
    echo "----------------------------------------"
done

echo "CloudFormation deployment process completed"

# --------------------------- Step 4: Attach the role ARN output to the respective environments ---------------------------

# Loop through environments to set up GitHub environment variables``
for i in "${!env_names[@]}"; do
    env="${env_names[$i]}"
    profile="${env_profiles[$i]}"
    
    # Use environment-specific stack name
    STACK_NAME="${STACK_NAME_BASE}-${env}"
    
    # Get the role ARN from the stack output for this environment
    ROLE_ARN=$(aws cloudformation describe-stacks \
        --stack-name "${STACK_NAME}" \
        --profile "${profile}" \
        --query "Stacks[0].Outputs[?OutputKey=='RoleArn'].OutputValue" \
        --output text)

    echo "${env} Account Role ARN: ${ROLE_ARN}"

    # Get the repository name (fixed quotes)
    REPO_NAME=$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')

    # Add AWS_ROLE and AWS_REGION to the environment
    echo "Adding AWS_ROLE and AWS_REGION to ${env} environment..."
    gh variable set AWS_ROLE -R "${REPO_NAME}" -e "${env}" -b "${ROLE_ARN}"
    gh variable set AWS_REGION -R "${REPO_NAME}" -e "${env}" -b "us-west-2"

    echo "✅ Successfully added AWS_ROLE and AWS_REGION to ${env} environment"
    echo "----------------------------------------"
done

echo "Environment variables setup completed"
