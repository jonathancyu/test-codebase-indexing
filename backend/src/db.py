"""Database session management using SQLModel and SQLAlchemy."""

import os
import logging
from datetime import datetime, timezone, timedelta
from sqlmodel import Session, create_engine
from service_connections.database.aurora import AuroraConnection


def get_db_url() -> str:
    """Get a fresh database URL with new auth token"""
    stack = os.environ.get("ENVIRONMENT", "dev")
    db_url = AuroraConnection().get_postgres_url(
        stack=f"PROJECT_NAME_PLACEHOLDER-infra-{stack}",
        region=os.environ.get("AWS_REGION", "us-west-2"),
        username="postgres",
        database="postgres",
        local_database=os.environ.get("LOCAL_DATABASE", "false").lower() == "true",
        connect_from_local=os.environ.get("CONNECT_FROM_LOCAL", "false").lower() == "true",
        endpoint=os.environ.get("AURORA_PROXY_ENDPOINT", ""),
    )

    # Convert postgres:// to postgresql:// for SQLAlchemy
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    return db_url

_engine = None
_engine_expiry = None

def get_engine():
    """Get SQLAlchemy engine, creating a new one if expired or missing."""
    global _engine, _engine_expiry

    # Check if we need to create/refresh the engine
    if _engine is None or (
        _engine_expiry and datetime.now(timezone.utc) >= _engine_expiry
    ):
        # Dispose of old engine if it exists
        if _engine is not None:
            _engine.dispose()

        # Create new engine with appropriate settings
        _engine = create_engine(
            get_db_url(),
            pool_pre_ping=True,      # Test connections before use
            pool_recycle=3600,       # Recycle connections after 1 hour (handles token expiry)
            pool_size=5,             # Maintain pool of connections
            max_overflow=10,         # Allow additional connections when needed
            connect_args={
                "connect_timeout": 3,
                "keepalives": 1,
                "keepalives_idle": 30,
                "keepalives_interval": 10,
                "keepalives_count": 5
            }
        )

        # Set expiry to 10 minutes (safe margin for 15-minute tokens)
        _engine_expiry = datetime.now(timezone.utc) + timedelta(minutes=10)

    return _engine

def get_db_session():
    """FastAPI dependency to get database session."""
    engine = get_engine()
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()