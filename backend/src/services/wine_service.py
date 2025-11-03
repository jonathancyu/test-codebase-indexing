from fastapi import Depends
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
import logging
from src.models.wine_models import Wine as WineModel
from src.db import get_db_session

logger = logging.getLogger(__name__)


class WineService:
    """Service class for wine-related business logic."""

    def __init__(self, session: Session = Depends(get_db_session)):
        self.session = session

    def _wine_to_dict(self, wine: WineModel) -> dict:
        """Convert WineModel instance to dictionary."""
        return {
            "id": wine.id,
            "name": wine.name,
            "varietal": wine.varietal,
            "vintage": wine.vintage,
            "region": wine.region,
            "price": wine.price,
            "description": wine.description,
            "created_at": wine.created_at
        }

    def get_all_wines(self) -> List[dict]:
        """Get all wines from the database."""
        logger.info("Getting all wines from database")

        try:
            wines = self.session.exec(select(WineModel)).all()
            wine_dicts = [self._wine_to_dict(wine) for wine in wines]
            logger.info(f"Found {len(wine_dicts)} wines")
            return wine_dicts

        except Exception as e:
            logger.error(f"Error getting wines: {str(e)}")
            raise e

    def create_wine(self, name: str, varietal: str, vintage: Optional[int] = None,
                   region: Optional[str] = None, price: Optional[float] = None,
                   description: Optional[str] = None) -> dict:
        """Create a new wine in the database."""
        logger.info(f"Creating wine with name: {name}, varietal: {varietal}")

        try:
            new_wine = WineModel(
                name=name,
                varietal=varietal,
                vintage=vintage,
                region=region,
                price=price,
                description=description
            )

            self.session.add(new_wine)
            self.session.commit()
            self.session.refresh(new_wine)  # Refresh to get the ID and created_at

            wine_data = self._wine_to_dict(new_wine)
            logger.info(f"Created wine: {wine_data}")
            return wine_data

        except Exception as e:
            logger.error(f"Error creating wine: {str(e)}")
            self.session.rollback()
            raise e

    def get_wine_by_id(self, wine_id: int) -> Optional[dict]:
        """Get a wine by its ID."""
        logger.info(f"Getting wine with ID: {wine_id}")

        try:
            wine = self.session.exec(select(WineModel).where(WineModel.id == wine_id)).first()

            if wine:
                wine_data = self._wine_to_dict(wine)
                logger.info(f"Found wine: {wine_data}")
                return wine_data
            else:
                logger.info(f"Wine with ID {wine_id} not found")
                return None

        except Exception as e:
            logger.error(f"Error getting wine by ID: {str(e)}")
            raise e

    def update_wine(self, wine_id: int, name: str = None, varietal: str = None,
                   vintage: int = None, region: str = None, price: float = None,
                   description: str = None) -> Optional[dict]:
        """Update a wine's information."""
        logger.info(f"Updating wine with ID: {wine_id}")

        try:
            wine = self.session.exec(select(WineModel).where(WineModel.id == wine_id)).first()

            if not wine:
                logger.warning(f"Wine with ID {wine_id} not found for update")
                return None

            # Update fields if provided
            if name is not None:
                wine.name = name

            if varietal is not None:
                wine.varietal = varietal

            if vintage is not None:
                wine.vintage = vintage

            if region is not None:
                wine.region = region

            if price is not None:
                wine.price = price

            if description is not None:
                wine.description = description

            if all(v is None for v in [name, varietal, vintage, region, price, description]):
                logger.warning("No fields to update")
                return self._wine_to_dict(wine)

            self.session.commit()
            self.session.refresh(wine)

            wine_data = self._wine_to_dict(wine)
            logger.info(f"Updated wine: {wine_data}")
            return wine_data

        except Exception as e:
            logger.error(f"Error updating wine: {str(e)}")
            self.session.rollback()
            raise e

    def delete_wine(self, wine_id: int) -> bool:
        """Delete a wine from the database."""
        logger.info(f"Deleting wine with ID: {wine_id}")

        try:
            wine = self.session.exec(select(WineModel).where(WineModel.id == wine_id)).first()

            if wine:
                self.session.delete(wine)
                self.session.commit()
                logger.info(f"Successfully deleted wine with ID: {wine_id}")
                return True
            else:
                logger.warning(f"Wine with ID {wine_id} not found for deletion")
                return False

        except Exception as e:
            logger.error(f"Error deleting wine: {str(e)}")
            self.session.rollback()
            raise e

