import requests
import os
import pytest
from ..test_config import load_test_environment

# Load environment variables before tests run
env_vars = load_test_environment()
API_BASE_URL = os.environ["API_URL"]  # This will be set by load_test_environment()


def test_get_users():
    """Test GET /users endpoint"""
    # Make request to get users
    response = requests.get(f"{API_BASE_URL}/users")

    # Assert response is successful
    assert response.status_code == 200

    # Assert response is a list
    users = response.json()
    assert isinstance(users, list)

    # If there are users, verify their structure
    if users:
        user = users[0]
        assert "id" in user
        assert "name" in user
        assert "email" in user
        assert "created_at" in user


def test_create_user():
    """Test POST /users endpoint"""
    # Test data
    test_name = "Test User"
    test_email = "test@example.com"
    
    # Make request to create user
    response = requests.post(
        f"{API_BASE_URL}/users",
        params={"name": test_name, "email": test_email}
    )
    
    # Assert response is successful
    assert response.status_code == 200
    
    # Assert response structure
    user = response.json()
    assert "id" in user
    assert "name" in user
    assert "email" in user
    assert "created_at" in user
    assert user["name"] == test_name
    assert user["email"] == test_email


def test_create_user_validation():
    """Test POST /users endpoint validation"""
    # Test empty name
    response = requests.post(
        f"{API_BASE_URL}/users",
        params={"name": "", "email": "test@example.com"}
    )
    assert response.status_code == 400
    assert "Name is required" in response.json()["detail"]
    
    # Test empty email
    response = requests.post(
        f"{API_BASE_URL}/users",
        params={"name": "Test User", "email": ""}
    )
    assert response.status_code == 400
    assert "Email is required" in response.json()["detail"]
    
    # Test invalid email format
    response = requests.post(
        f"{API_BASE_URL}/users",
        params={"name": "Test User", "email": "invalid-email"}
    )
    assert response.status_code == 400
    assert "Invalid email format" in response.json()["detail"]
    
    # Test whitespace-only name
    response = requests.post(
        f"{API_BASE_URL}/users",
        params={"name": "   ", "email": "test@example.com"}
    )
    assert response.status_code == 400
    assert "Name is required" in response.json()["detail"]


def test_get_user_by_id():
    """Test GET /users/{user_id} endpoint"""
    # First create a user to test with
    create_response = requests.post(
        f"{API_BASE_URL}/users",
        params={"name": "Test User for ID", "email": "testid@example.com"}
    )
    assert create_response.status_code == 200
    created_user = create_response.json()
    user_id = created_user["id"]
    
    # Test getting the user by ID
    response = requests.get(f"{API_BASE_URL}/users/{user_id}")
    assert response.status_code == 200
    
    user = response.json()
    assert user["id"] == user_id
    assert user["name"] == "Test User for ID"
    assert user["email"] == "testid@example.com"
    assert "created_at" in user


def test_get_user_by_id_validation():
    """Test GET /users/{user_id} endpoint validation"""
    # Test invalid user ID (0)
    response = requests.get(f"{API_BASE_URL}/users/0")
    assert response.status_code == 400
    assert "Invalid user ID" in response.json()["detail"]
    
    # Test invalid user ID (negative)
    response = requests.get(f"{API_BASE_URL}/users/-1")
    assert response.status_code == 400
    assert "Invalid user ID" in response.json()["detail"]
    
    # Test non-existent user ID
    response = requests.get(f"{API_BASE_URL}/users/99999")
    assert response.status_code == 404
    assert "User not found" in response.json()["detail"]


def test_update_user():
    """Test PUT /users/{user_id} endpoint"""
    # First create a user to update
    create_response = requests.post(
        f"{API_BASE_URL}/users",
        params={"name": "Original Name", "email": "original@example.com"}
    )
    assert create_response.status_code == 200
    created_user = create_response.json()
    user_id = created_user["id"]
    
    # Test updating name only
    response = requests.put(
        f"{API_BASE_URL}/users/{user_id}",
        params={"name": "Updated Name"}
    )
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["name"] == "Updated Name"
    assert updated_user["email"] == "original@example.com"
    
    # Test updating email only
    response = requests.put(
        f"{API_BASE_URL}/users/{user_id}",
        params={"email": "updated@example.com"}
    )
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["name"] == "Updated Name"
    assert updated_user["email"] == "updated@example.com"
    
    # Test updating both name and email
    response = requests.put(
        f"{API_BASE_URL}/users/{user_id}",
        params={"name": "Final Name", "email": "final@example.com"}
    )
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["name"] == "Final Name"
    assert updated_user["email"] == "final@example.com"


def test_update_user_validation():
    """Test PUT /users/{user_id} endpoint validation"""
    # First create a user to test with
    create_response = requests.post(
        f"{API_BASE_URL}/users",
        params={"name": "Test User", "email": "test@example.com"}
    )
    assert create_response.status_code == 200
    user_id = create_response.json()["id"]
    
    # Test invalid user ID (0)
    response = requests.put(
        f"{API_BASE_URL}/users/0",
        params={"name": "Updated Name"}
    )
    assert response.status_code == 400
    assert "Invalid user ID" in response.json()["detail"]
    
    # Test invalid user ID (negative)
    response = requests.put(
        f"{API_BASE_URL}/users/-1",
        params={"name": "Updated Name"}
    )
    assert response.status_code == 400
    assert "Invalid user ID" in response.json()["detail"]
    
    # Test empty name
    response = requests.put(
        f"{API_BASE_URL}/users/{user_id}",
        params={"name": ""}
    )
    assert response.status_code == 400
    assert "Name cannot be empty" in response.json()["detail"]
    
    # Test whitespace-only name
    response = requests.put(
        f"{API_BASE_URL}/users/{user_id}",
        params={"name": "   "}
    )
    assert response.status_code == 400
    assert "Name cannot be empty" in response.json()["detail"]
    
    # Test invalid email format
    response = requests.put(
        f"{API_BASE_URL}/users/{user_id}",
        params={"email": "invalid-email"}
    )
    assert response.status_code == 400
    assert "Invalid email format" in response.json()["detail"]
    
    # Test empty email
    response = requests.put(
        f"{API_BASE_URL}/users/{user_id}",
        params={"email": ""}
    )
    assert response.status_code == 400
    assert "Invalid email format" in response.json()["detail"]
    
    # Test non-existent user ID
    response = requests.put(
        f"{API_BASE_URL}/users/99999",
        params={"name": "Updated Name"}
    )
    assert response.status_code == 404
    assert "User not found" in response.json()["detail"]


def test_delete_user():
    """Test DELETE /users/{user_id} endpoint"""
    # First create a user to delete
    create_response = requests.post(
        f"{API_BASE_URL}/users",
        params={"name": "User to Delete", "email": "delete@example.com"}
    )
    assert create_response.status_code == 200
    created_user = create_response.json()
    user_id = created_user["id"]
    
    # Test deleting the user
    response = requests.delete(f"{API_BASE_URL}/users/{user_id}")
    assert response.status_code == 200
    
    delete_response = response.json()
    assert delete_response["message"] == "User deleted successfully"
    assert delete_response["user_id"] == user_id
    
    # Verify user is actually deleted by trying to get it
    get_response = requests.get(f"{API_BASE_URL}/users/{user_id}")
    assert get_response.status_code == 404


def test_delete_user_validation():
    """Test DELETE /users/{user_id} endpoint validation"""
    # Test invalid user ID (0)
    response = requests.delete(f"{API_BASE_URL}/users/0")
    assert response.status_code == 400
    assert "Invalid user ID" in response.json()["detail"]
    
    # Test invalid user ID (negative)
    response = requests.delete(f"{API_BASE_URL}/users/-1")
    assert response.status_code == 400
    assert "Invalid user ID" in response.json()["detail"]
    
    # Test non-existent user ID
    response = requests.delete(f"{API_BASE_URL}/users/99999")
    assert response.status_code == 404
    assert "User not found" in response.json()["detail"]
