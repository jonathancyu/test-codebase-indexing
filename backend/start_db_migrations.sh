#!/bin/bash
set -e

echo "Starting database migrations..."
# Debug information
echo "Current directory: $(pwd)"
echo "Python path: $PYTHONPATH"
echo "Database host: $DB_HOST"
echo "Database local: $LOCAL_DATABASE"

# Make sure we can find the backend package 
export PYTHONPATH=$PYTHONPATH

# Run the migrations
echo "Running database migrations with database-management upgrade..."
poetry run database-management upgrade

echo "Database migrations completed successfully." 