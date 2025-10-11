#!/bin/bash
set -e

# Install the package in development mode if not already installed
if ! poetry show docs &>/dev/null; then
    echo "Installing docs package..."
    poetry install
fi

# Generate OpenAPI schema
echo "Generating OpenAPI schema..."
poetry run docs-generate-openapi

# Serve docs
echo "Starting MkDocs server..."
poetry run mkdocs serve -a 0.0.0.0:8001