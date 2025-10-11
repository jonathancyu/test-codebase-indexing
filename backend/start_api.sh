#!/bin/bash

if [ "${LOCAL_DATABASE}" = "true" ]; then
    echo "Using local database"
else
    echo "Using Aurora database with IAM authentication"
fi

# Start the API server
echo "Starting API server..."
poetry run uvicorn backend_code.api.app:app --host 0.0.0.0 --port 8000 --reload
