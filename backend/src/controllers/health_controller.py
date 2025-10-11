from fastapi import APIRouter
from fastapi.responses import JSONResponse
import logging
from src.db import get_db_session
from sqlmodel import Session, select
from fastapi import Depends

logger = logging.getLogger()

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check(session: Session = Depends(get_db_session)):
    try:
        session.exec(select(1)).first()
        return {"status": "healthy"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=500, content={"status": "unhealthy", "error": str(e)}
        )

@router.get("/ping")
async def ping():
    """Simple ping endpoint that doesn't touch the database."""
    logger.info("Ping endpoint called")
    return {"status": "ok"}
