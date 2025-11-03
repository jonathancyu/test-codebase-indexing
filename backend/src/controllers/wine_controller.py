from fastapi import Depends, HTTPException, Request
from typing import List, Optional
import logging
import traceback
from fastapi import APIRouter
from src.services.wine_service import WineService

router = APIRouter(tags=["wines"])

logger = logging.getLogger(__name__)

@router.get("/wines")
async def get_wines(request: Request, wine_service: WineService = Depends(WineService)) -> List[dict]:
    """Handle GET /wines request."""
    logger.info("GET /wines endpoint called")
    logger.info("Request headers and environment:")
    logger.info(f"Headers: {dict(request.headers)}")

    try:
        wines = wine_service.get_all_wines()
        logger.info(f"Returning {len(wines)} wines")
        return wines

    except Exception as e:
        logger.error(f"Error getting wines: {str(e)}")
        logger.error(f"Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/wines")
async def create_wine_endpoint(
    name: str,
    varietal: str,
    vintage: Optional[int] = None,
    region: Optional[str] = None,
    price: Optional[float] = None,
    description: Optional[str] = None,
    wine_service: WineService = Depends(WineService)
) -> dict:
    """Handle POST /wines request."""
    logger.info(f"Creating wine with name: {name}, varietal: {varietal}")

    try:
        # Basic validation
        if not name or not name.strip():
            raise HTTPException(status_code=400, detail="Name is required")

        if not varietal or not varietal.strip():
            raise HTTPException(status_code=400, detail="Varietal is required")

        # Validate vintage if provided
        if vintage is not None and (vintage < 1900 or vintage > 2100):
            raise HTTPException(status_code=400, detail="Invalid vintage year")

        # Validate price if provided
        if price is not None and price < 0:
            raise HTTPException(status_code=400, detail="Price cannot be negative")

        wine = wine_service.create_wine(
            name.strip(),
            varietal.strip(),
            vintage,
            region.strip() if region else None,
            price,
            description.strip() if description else None
        )
        logger.info(f"Successfully created wine: {wine}")
        return wine

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error creating wine: {str(e)}")
        logger.error(f"Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/wines/{wine_id}")
async def get_wine_by_id_endpoint(wine_id: int, wine_service: WineService = Depends(WineService)) -> dict:
    """Handle GET /wines/{wine_id} request."""
    logger.info(f"Getting wine with ID: {wine_id}")

    try:
        if wine_id <= 0:
            raise HTTPException(status_code=400, detail="Invalid wine ID")

        wine = wine_service.get_wine_by_id(wine_id)

        if not wine:
            raise HTTPException(status_code=404, detail="Wine not found")

        return wine

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error getting wine by ID: {str(e)}")
        logger.error(f"Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/wines/{wine_id}")
async def update_wine_endpoint(
    wine_id: int,
    name: Optional[str] = None,
    varietal: Optional[str] = None,
    vintage: Optional[int] = None,
    region: Optional[str] = None,
    price: Optional[float] = None,
    description: Optional[str] = None,
    wine_service: WineService = Depends(WineService)
) -> dict:
    """Handle PUT /wines/{wine_id} request."""
    logger.info(f"Updating wine with ID: {wine_id}")

    try:
        if wine_id <= 0:
            raise HTTPException(status_code=400, detail="Invalid wine ID")

        # Validate inputs if provided
        if name is not None and not name.strip():
            raise HTTPException(status_code=400, detail="Name cannot be empty")

        if varietal is not None and not varietal.strip():
            raise HTTPException(status_code=400, detail="Varietal cannot be empty")

        if vintage is not None and (vintage < 1900 or vintage > 2100):
            raise HTTPException(status_code=400, detail="Invalid vintage year")

        if price is not None and price < 0:
            raise HTTPException(status_code=400, detail="Price cannot be negative")

        # Clean inputs
        clean_name = name.strip() if name else None
        clean_varietal = varietal.strip() if varietal else None
        clean_region = region.strip() if region else None
        clean_description = description.strip() if description else None

        wine = wine_service.update_wine(
            wine_id,
            clean_name,
            clean_varietal,
            vintage,
            clean_region,
            price,
            clean_description
        )

        if not wine:
            raise HTTPException(status_code=404, detail="Wine not found")

        logger.info(f"Successfully updated wine: {wine}")
        return wine

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error updating wine: {str(e)}")
        logger.error(f"Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/wines/{wine_id}")
async def delete_wine_endpoint(wine_id: int, wine_service: WineService = Depends(WineService)) -> dict:
    """Handle DELETE /wines/{wine_id} request."""
    logger.info(f"Deleting wine with ID: {wine_id}")

    try:
        if wine_id <= 0:
            raise HTTPException(status_code=400, detail="Invalid wine ID")

        success = wine_service.delete_wine(wine_id)

        if not success:
            raise HTTPException(status_code=404, detail="Wine not found")

        logger.info(f"Successfully deleted wine with ID: {wine_id}")
        return {"message": "Wine deleted successfully", "wine_id": wine_id}

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error deleting wine: {str(e)}")
        logger.error(f"Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

