FROM public.ecr.aws/lambda/python:3.12

# Install poetry
RUN pip install poetry

# Configure poetry with CodeArtifact
ARG CODEARTIFACT_TOKEN
RUN echo "CodeArtifact token length: ${#CODEARTIFACT_TOKEN}" && \
    poetry config repositories.codeartifact \
    https://packages-982534352120.d.codeartifact.us-west-2.amazonaws.com/pypi/pypi-store/simple/ && \
    poetry config http-basic.codeartifact aws "${CODEARTIFACT_TOKEN}" && \
    poetry config virtualenvs.create false

# Copy project files
COPY pyproject.toml poetry.lock* ${LAMBDA_TASK_ROOT}/

# Set working directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Install dependencies
RUN poetry install --no-interaction --no-ansi && \
    poetry add service_connections --source codeartifact && \
    poetry show && \
    echo "Verifying installations..." && \
    pip list

# Copy application code
COPY src/ ${LAMBDA_TASK_ROOT}/src/
COPY lambda_handler.py ${LAMBDA_TASK_ROOT}/

# Verify final setup
RUN echo "Final verification..." && \
    ls -la ${LAMBDA_TASK_ROOT} && \
    python -c "from service_connections.database import aurora; from mangum import Mangum; from fastapi import FastAPI; print('Imports verified')" && \
    python -c "from environment_variable_manager.core.secrets_manager import set_env_vars_from_aws"

CMD ["lambda_handler.main"]