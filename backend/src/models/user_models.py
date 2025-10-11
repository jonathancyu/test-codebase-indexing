from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


# Database Model
class User(Base):
    """SQLAlchemy database model for users."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    role = Column(String(50), nullable=True)
    last_login = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<User(id={self.id}, name='{self.name}', email='{self.email}', role='{self.role}')>"


# Pydantic Models for API
class UserCreateRequest(BaseModel):
    """Request model for creating a new user."""
    name: str
    email: str
    
    class Config:
        schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john.doe@example.com"
            }
        }


class UserUpdateRequest(BaseModel):
    """Request model for updating a user."""
    name: Optional[str] = None
    email: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "name": "Jane Doe",
                "email": "jane.doe@example.com"
            }
        }


class UserResponse(BaseModel):
    """Response model for user data."""
    id: int
    name: str
    email: str
    created_at: datetime
    
    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "name": "John Doe",
                "email": "john.doe@example.com",
                "created_at": "2023-01-01T10:00:00Z"
            }
        }


class UserDeleteResponse(BaseModel):
    """Response model for user deletion."""
    message: str
    user_id: int
    
    class Config:
        schema_extra = {
            "example": {
                "message": "User deleted successfully",
                "user_id": 1
            }
        }