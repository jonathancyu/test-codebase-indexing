# Database Lambda

This Lambda function provides a FastAPI application that can be run both locally and deployed to AWS Lambda.

## Running Modes

1. **Lambda Deployment**

   - Connects directly to RDS Proxy
   - Uses IAM authentication
   - Managed by AWS CDK

2. **Local Development with Aurora**

   - Uses service-connections for port forwarding
   - Connects through localhost
   - Uses IAM authentication

3. **Local Development with Docker**
   - Uses local Postgres container
   - Simple password authentication
   - Great for quick testing

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### For Aurora Connection:

```env
DEPLOYMENT_TYPE=local
STACK_NAME=your-stack-name
ACTUAL_PROXY_ENDPOINT=your-aurora-endpoint
```

### For Local Database:

```env
DEPLOYMENT_TYPE=local
USE_LOCAL_DB=true
```

## Running Locally

1. With Aurora:

```bash
# Start database proxy
pnpm run db:start

# Start API
pnpm run api:dev
```

2. With Local Database:

```bash
# Start everything
docker-compose --profile local-db up
```

## API Endpoints

- GET /health - Health check endpoint
- GET /users - List all users
- POST /users - Create a new user

## Database Migrations

Migrations are managed using Alembic through the database-management package:

```bash
# Create new migration
pnpm run db:migrate:create

# Run migrations
pnpm run db:migrate

# Check status
pnpm run db:migrate:status
```

## Deployment

The Lambda is deployed as a container image using AWS CDK. The deployment:

- Uses Docker container image
- Configures VPC and security group access
- Sets up IAM permissions for RDS Proxy access
- Manages environment variables automatically

## Troubleshooting

If you encounter connection issues:

1. Check the logs for detailed connection information
2. Verify environment variables are set correctly
3. Ensure database proxy is running for local development
4. Confirm VPC and security group settings for Lambda deployment
