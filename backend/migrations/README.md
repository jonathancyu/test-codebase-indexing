# Example Database Project

This project manages database schemas and migrations for the Three Tier App.

## Prerequisites

- Poetry (Python package manager)
- AWS SSO credentials configured
- Docker (for local development)

## Getting Started

1. Install dependencies:

```bash
poetry install
```

2. Set up your environment:

```bash
export STACK_NAME=PROJECT_NAME_PLACEHOLDER-infra-dev  # or your stack name
```

## Database Management

### Migration Workflow

1. Update Model Definition:

   - Modify models in `backend/src/models.py`
   - Example adding a field:

   ```python
   class User(Base):
       __tablename__ = 'users'
       id = Column(Integer, primary_key=True)
       name = Column(String(255), nullable=False)
       email = Column(String(255), nullable=False)
       created_at = Column(DateTime, server_default=func.now())
       role = Column(String(50), nullable=True)  # New field
   ```

2. Generate Migration:

```bash
database-management migrate -m "describe your changes" --stack $STACK_NAME
```

3. Review Generated Migration:

   - Check the new file in `migrations/versions/`
   - Verify the upgrade() and downgrade() operations

4. Apply Migration:

```bash
database-management upgrade --stack $STACK_NAME
```

5. Verify Changes:

```bash
# Check current migration version
database-management current --stack $STACK_NAME

# View updated schema
database-management describe --stack $STACK_NAME
```

### Common Operations

1. Create a new table:

   - Add model class to `models.py`
   - Generate and apply migration

2. Modify existing table:

   - Update model in `models.py`
   - Generate and apply migration

3. Rollback changes:

```bash
# Rollback one version
database-management downgrade -1 --stack $STACK_NAME

# Rollback to specific version
database-management downgrade <version_id> --stack $STACK_NAME
```

### Database Models

Define your models in `models.py`. Example:

```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
```

## Troubleshooting

1. AWS Token Expired:

```bash
aws sso login
```

2. Database Connection Issues:

   - Verify stack name is correct
   - Check AWS credentials
   - Ensure you're connected to VPN if required

3. Migration Issues:
   - Check that models.py is in sync with database
   - Verify PYTHONPATH includes the models directory
   - Review migration files for correct dependencies

## Available Commands

- `poetry run db new-migration "message"` - Create a new migration
- `poetry run database-management upgrade --stack <stack>` - Apply migrations
- `poetry run database-management describe --stack <stack>` - View schema
- `poetry run database-management current --stack <stack>` - Show migration version
