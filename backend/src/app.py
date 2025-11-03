import logging
import os
from environment_variable_manager.core.secrets_manager import set_env_vars_from_aws
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Load environment variables from AWS Secrets Manager
env_vars = set_env_vars_from_aws(
    secret_name=os.environ["ENVIRONMENT_VARIABLES_SECRET_NAME"]
)

from src.controllers import health_controller, user_controller, wine_controller

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="Three-Tier User API",
    description="A three-tier architecture API for user management",
    version="1.0.0",
    root_path="/v1",
)

# Add CORS middleware with more permissive settings for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,  # Cache preflight requests for 24 hours
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests and responses."""
    logger.info("\n=== Incoming Request ===")
    logger.info(f"Method: {request.method}")
    logger.info(f"URL: {request.url}")
    logger.info(f"Path: {request.url.path}")
    logger.info(f"Root Path: {request.scope.get('root_path')}")
    logger.info(f"Headers: {dict(request.headers)}")
    logger.info(f"Client Host: {request.client.host if request.client else 'Unknown'}")

    response = await call_next(request)

    logger.info(f"Response Status: {response.status_code}")
    logger.info("=== End Request ===\n")
    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle uncaught exceptions."""
    logger.error(f"Unhandled exception: {str(exc)}")
    logger.error(f"Request URL: {request.url}")
    logger.error(f"Request method: {request.method}")

    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "detail": "An unexpected error occurred"},
    )


# Include routers
app.include_router(user_controller.router, prefix="/api/v1")
app.include_router(wine_controller.router, prefix="/api/v1")
app.include_router(health_controller.router, prefix="/api/v1")


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to the Three-Tier User API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
