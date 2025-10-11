# API Specs

## Swagger Docs

The following OpenAPI specifications are available to interact with the application database.

!!swagger openapi.json!!

## Updating the Specs

The OpenAPI specification is automatically generated using the FastAPI application. To update these specs:

1. Make sure you're authenticated with AWS:

```bash
aws sso login --profile {your-profile}
export AWS_PROFILE={your-profile}
```

2. Run the generation script:

```bash
python docs/generate_openapi_json.py
```

This will update the `docs/docs/api/openapi.json` file with the latest API specifications from your FastAPI application.

The API specifications will also be updated as part of starting the `mkdocs` server.  