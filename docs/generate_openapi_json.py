"""Generate OpenAPI JSON documentation for the FastAPI application.

This script generates OpenAPI documentation by extracting the schema from
the FastAPI application and saving it to a JSON file.

Prerequisites:
    1. AWS SSO Configuration:
       - Must have AWS SSO credentials configured
       - Run: `aws sso login --profile <your-profile>`
       - Set: `export AWS_PROFILE=<your-profile>`

    2. Python Environment:
       - Activated virtual environment with required dependencies
       - FastAPI and all backend dependencies installed from /backend/requirements.txt

Usage:
    From the project root directory:
    ```
    python docs/generate_openapi_json.py
    ```

Output:
    Creates or updates ./docs/openapi.json with the latest API schema

Note:
    This script assumes the FastAPI app is properly configured with
    all necessary environment variables and AWS credentials.
"""

import json
import sys
from pathlib import Path


def import_app():
    """Import the FastAPI app from the backend directory."""
    # Add the backend directory to Python path
    backend_path = Path(__file__).parent.parent / "backend"
    sys.path.insert(0, str(backend_path))

    # Import the main FastAPI app
    # Note: Adjust the import path based on where your FastAPI app is defined
    try:
        from tests.test_config import load_test_environment  # type: ignore

        env_vars = load_test_environment()

        from backend_code.api.app import app  # type: ignore

        return app
    except ImportError as e:
        print(f"Error: Could not import FastAPI app: {e}")
        print("Make sure your FastAPI app is defined in backend/main.py")
        sys.exit(1)


def generate_openapi_json():
    """Generate OpenAPI JSON documentation from FastAPI app."""
    app = import_app()

    # Get the OpenAPI schema
    openapi_schema = app.openapi()

    # Create docs directory if it doesn't exist
    docs_dir = Path(__file__).parent
    docs_dir.mkdir(exist_ok=True)

    # Save the OpenAPI schema to a JSON file
    output_file = docs_dir / "docs/api/openapi.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(openapi_schema, f, indent=2)

    print(f"OpenAPI documentation generated successfully: {output_file}")


if __name__ == "__main__":
    generate_openapi_json()
