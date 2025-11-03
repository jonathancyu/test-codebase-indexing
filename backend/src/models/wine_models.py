from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


# Database Model
class Wine(Base):
    """SQLAlchemy database model for wines."""

    __tablename__ = "wines"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    varietal = Column(String(100), nullable=False)
    vintage = Column(Integer, nullable=True)
    region = Column(String(255), nullable=True)
    price = Column(Float, nullable=True)
    description = Column(String(1000), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<Wine(id={self.id}, name='{self.name}', varietal='{self.varietal}', vintage={self.vintage})>"


# Pydantic Models for API
class WineCreateRequest(BaseModel):
    """Request model for creating a new wine."""

    name: str
    varietal: str
    vintage: Optional[int] = None
    region: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "name": "Château Margaux",
                "varietal": "Cabernet Sauvignon",
                "vintage": 2015,
                "region": "Bordeaux, France",
                "price": 450.00,
                "description": "A rich and elegant wine with notes of blackcurrant and oak"
            }
        }


class WineUpdateRequest(BaseModel):
    """Request model for updating a wine."""

    name: Optional[str] = None
    varietal: Optional[str] = None
    vintage: Optional[int] = None
    region: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "name": "Château Margaux Grand Cru",
                "price": 475.00
            }
        }


class WineResponse(BaseModel):
    """Response model for wine data."""

    id: int
    name: str
    varietal: str
    vintage: Optional[int]
    region: Optional[str]
    price: Optional[float]
    description: Optional[str]
    created_at: datetime

    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "name": "Château Margaux",
                "varietal": "Cabernet Sauvignon",
                "vintage": 2015,
                "region": "Bordeaux, France",
                "price": 450.00,
                "description": "A rich and elegant wine with notes of blackcurrant and oak",
                "created_at": "2023-01-01T10:00:00Z",
            }
        }


class WineDeleteResponse(BaseModel):
    """Response model for wine deletion."""

    message: str
    wine_id: int

    class Config:
        schema_extra = {"example": {"message": "Wine deleted successfully", "wine_id": 1}}

