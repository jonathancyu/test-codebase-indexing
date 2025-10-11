# Database Connectivity

The Aurora Postgres database resides in an isolated AWS VPC. Connections require port forwarding from a local machine to an EC2 instance within the VPC. An NGINX server on the EC2 instance forwards requests to the database. AWS SSM (Session Manager) authenticates these connections using AWS credentials controlled by the 8090 Okta application.

## Database Connection

The connection process requires AWS authentication and profile configuration:

!!! Note
    AWS Session Manager plugin must be installed on your local machine before using the `service_connections` library. See [Install the Session Manager plugin for the AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html) for more information.

This project relies on the `service_connections` and `database_management` 8090 software factory components. For information on how to use the service_connections library, see the [service_connections documentation](https://stunning-adventure-ozgjm91.pages.github.io/user_guide/tools/service_connections/).

## Database Management

The data layer uses Alembic in conjunction with the `database_management` CLI from the software factory for managing database migrations. Migration files are stored in `backend/migrations/`. See more information [here](https://github.com/8090-inc/constructs/tree/main/tools/database_management) regarding the database_management CLI.

You do not need to run the `service-connect` command to run database management commands. They will automatically connect to the database using the service-connections library.

### Migrations in AWS

!!! Note
    You must be in the `backend` directory to run database management commands.

To create a new migration for the PostgreSQL database in AWS, you can run the following command with a custom message. This will create a new migration file in the `backend/migrations/versions` directory which defines the changes to the database. Please note, these migrations will NOT be created through CICD, so you will need to manually run the migration command when a migration is needed. This promotes a practice of reviewing migrations before they are deployed to any environment.

```bash
database-management migrate --stack {StackName} --message "Add new field to table X"
```

Once the migration is created, you can run it against the database using the following command. This will apply the changes to the database.

```bash
database-management upgrade --stack {StackName}
```

If you need to downgrade the database, you can run the following command. This will roll back the database by one version.

```bash
database-management downgrade --stack {StackName}
```

You can also downgrade to a specific revision:

```bash
database-management downgrade --stack {StackName} --revision <revision_id>
```

To check the current migration version:

```bash
database-management current --stack {StackName}
```

To view the database schema:

```bash
database-management describe --stack {StackName}
```

### Migrations in Local Development

To create a migration in local development which is compatible with the database in AWS, you can continue to use `database-management`.  Details for how to use `database-management` with a `LOCAL_DATABASE` can be found [here](https://docs.resources.8090.dev/user_guide/tools/database_management/#local-database-development).  The key is to include:

```bash
export DB_HOST=localhost
```

You can then run 
```
database-management upgrade
```
and 

```
database-management describe
```

As part of the Local API - Local DB deve environment, the database will be initalized as part of the `db-init` container.  This will perform an `upgrade` on the local database using the current values in `./backend/migrations/versions`