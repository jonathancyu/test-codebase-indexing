from fastapi import Depends
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
import logging
from src.models.user_models import User as UserModel
from src.db import get_db_session

logger = logging.getLogger(__name__)


class UserService:
    """Service class for user-related business logic."""
    
    def __init__(self, session: Session = Depends(get_db_session)):
        self.session = session

    def _user_to_dict(self, user: UserModel) -> dict:
        """Convert UserModel instance to dictionary."""
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at,
            "role": user.role,
            "last_login": user.last_login
        }

    def get_all_users(self) -> List[dict]:
        """Get all users from the database."""
        logger.info("Getting all users from database")
        
        try:
            users = self.session.exec(select(UserModel)).all()
            user_dicts = [self._user_to_dict(user) for user in users]
            logger.info(f"Found {len(user_dicts)} users")
            return user_dicts
            
        except Exception as e:
            logger.error(f"Error getting users: {str(e)}")
            raise e
    
    def create_user(self, name: str, email: str) -> dict:
        """Create a new user in the database."""
        logger.info(f"Creating user with name: {name}, email: {email}")
        
        try:
            new_user = UserModel(
                name=name,
                email=email
            )
            
            self.session.add(new_user)
            self.session.commit()
            self.session.refresh(new_user)  # Refresh to get the ID and created_at
            
            user_data = self._user_to_dict(new_user)
            logger.info(f"Created user: {user_data}")
            return user_data
            
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            self.session.rollback()
            raise e
    
    def get_user_by_id(self, user_id: int) -> Optional[dict]:
        """Get a user by their ID."""
        logger.info(f"Getting user with ID: {user_id}")
        
        try:
            user = self.session.exec(select(UserModel).where(UserModel.id == user_id)).first()
            
            if user:
                user_data = self._user_to_dict(user)
                logger.info(f"Found user: {user_data}")
                return user_data
            else:
                logger.info(f"User with ID {user_id} not found")
                return None
                
        except Exception as e:
            logger.error(f"Error getting user by ID: {str(e)}")
            raise e
    
    def update_user(self, user_id: int, name: str = None, email: str = None) -> Optional[dict]:
        """Update a user's information."""
        logger.info(f"Updating user with ID: {user_id}")
        
        try:
            user = self.session.exec(select(UserModel).where(UserModel.id == user_id)).first()
            
            if not user:
                logger.warning(f"User with ID {user_id} not found for update")
                return None
            
            # Update fields if provided
            if name is not None:
                user.name = name
            
            if email is not None:
                user.email = email
            
            if name is None and email is None:
                logger.warning("No fields to update")
                return self._user_to_dict(user)
            
            self.session.commit()
            self.session.refresh(user)
            
            user_data = self._user_to_dict(user)
            logger.info(f"Updated user: {user_data}")
            return user_data
                
        except Exception as e:
            logger.error(f"Error updating user: {str(e)}")
            self.session.rollback()
            raise e
    
    def delete_user(self, user_id: int) -> bool:
        """Delete a user from the database."""
        logger.info(f"Deleting user with ID: {user_id}")
        
        try:
            user = self.session.exec(select(UserModel).where(UserModel.id == user_id)).first()
            
            if user:
                self.session.delete(user)
                self.session.commit()
                logger.info(f"Successfully deleted user with ID: {user_id}")
                return True
            else:
                logger.warning(f"User with ID {user_id} not found for deletion")
                return False
                
        except Exception as e:
            logger.error(f"Error deleting user: {str(e)}")
            self.session.rollback()
            raise e
