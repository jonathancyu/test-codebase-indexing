from fastapi import Depends, HTTPException, Request
from typing import List, Optional
import logging
import traceback
from fastapi import APIRouter
from src.services.user_service import UserService

router = APIRouter(tags=["users"])

logger = logging.getLogger(__name__)

@router.get("/users")
async def get_users(request: Request, user_service: UserService = Depends(UserService)) -> List[dict]:
    """Handle GET /users request."""
    logger.info("GET /users endpoint called")
    logger.info("Request headers and environment:")
    logger.info(f"Headers: {dict(request.headers)}")
    
    try:
        users = user_service.get_all_users()
        logger.info(f"Returning {len(users)} users")
        return users
        
    except Exception as e:
        logger.error(f"Error getting users: {str(e)}")
        logger.error(f"Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/users")
async def create_user_endpoint(name: str, email: str, user_service: UserService = Depends(UserService)) -> dict:
    """Handle POST /users request."""
    logger.info(f"Creating user with name: {name}, email: {email}")
    
    try:
        # Basic validation
        if not name or not name.strip():
            raise HTTPException(status_code=400, detail="Name is required")
        
        if not email or not email.strip():
            raise HTTPException(status_code=400, detail="Email is required")
        
        # Basic email validation
        if "@" not in email:
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        user = user_service.create_user(name.strip(), email.strip())
        logger.info(f"Successfully created user: {user}")
        return user
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        logger.error(f"Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users/{user_id}")
async def get_user_by_id_endpoint(user_id: int, user_service: UserService = Depends(UserService)) -> dict:
    """Handle GET /users/{user_id} request."""
    logger.info(f"Getting user with ID: {user_id}")
    
    try:
        if user_id <= 0:
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        user = user_service.get_user_by_id(user_id)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error getting user by ID: {str(e)}")
        logger.error(f"Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/users/{user_id}")
async def update_user_endpoint(user_id: int, name: Optional[str] = None, email: Optional[str] = None, user_service: UserService = Depends(UserService)) -> dict:
    """Handle PUT /users/{user_id} request."""
    logger.info(f"Updating user with ID: {user_id}")
    
    try:
        if user_id <= 0:
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        # Validate inputs if provided
        if name is not None and not name.strip():
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        
        if email is not None and (not email.strip() or "@" not in email):
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        # Clean inputs
        clean_name = name.strip() if name else None
        clean_email = email.strip() if email else None
        
        user = user_service.update_user(user_id, clean_name, clean_email)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"Successfully updated user: {user}")
        return user
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        logger.error(f"Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/users/{user_id}")
async def delete_user_endpoint(user_id: int, user_service: UserService = Depends(UserService)) -> dict:
    """Handle DELETE /users/{user_id} request."""
    logger.info(f"Deleting user with ID: {user_id}")
    
    try:
        if user_id <= 0:
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        success = user_service.delete_user(user_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
        
        logger.info(f"Successfully deleted user with ID: {user_id}")
        return {"message": "User deleted successfully", "user_id": user_id}
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error deleting user: {str(e)}")
        logger.error(f"Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
