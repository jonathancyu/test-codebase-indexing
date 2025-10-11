# PROJECT_NAME_PLACEHOLDER Documentation

Welcome to the technical documentation for the PROJECT_NAME_PLACEHOLDER project.

Please refer to the [Data Layer](data-layer/index.md) to gain an understanding of the project's core data concepts as a good starting point.

## Repository Organization

The repository is organized as follows:

```
├── backend
├── docs
├── frontend
├── infra
```

- `backend` - Contains the python application for APIs.
- `docs` - Contains the documentation for the project.
- `frontend` - Contains the ui components
- `infra/src` - Contains the AWS CDK infrastructure which deploys the project to AWS.
- `infra/cicd` - Contains the CI/CD setup for the project.

Each of these directories has a mirrored directory in the `docs` folder which you can refer to for the detailed documentation on each topic.

Please note, there are other directories in the repository which are mentioned throughout the documentation, but these four are the most critical.

## Running Documentation Locally

To run this documentation site locally:

```bash
pip install -r docs/requirements-docs.txt
mkdocs serve -f docs/mkdocs.yml
```

This will start a local server at http://127.0.0.1:8000
