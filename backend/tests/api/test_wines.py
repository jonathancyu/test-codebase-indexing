import requests
import os
import pytest
from ..test_config import load_test_environment

# Load environment variables before tests run
env_vars = load_test_environment()
API_BASE_URL = os.environ["API_URL"]  # This will be set by load_test_environment()


def test_get_wines():
    """Test GET /wines endpoint"""
    # Make request to get wines
    response = requests.get(f"{API_BASE_URL}/wines")

    # Assert response is successful
    assert response.status_code == 200

    # Assert response is a list
    wines = response.json()
    assert isinstance(wines, list)

    # If there are wines, verify their structure
    if wines:
        wine = wines[0]
        assert "id" in wine
        assert "name" in wine
        assert "varietal" in wine
        assert "created_at" in wine


def test_create_wine():
    """Test POST /wines endpoint"""
    # Test data
    test_name = "Château Margaux"
    test_varietal = "Cabernet Sauvignon"
    test_vintage = 2015
    test_region = "Bordeaux, France"
    test_price = 450.00
    test_description = "A rich and elegant wine"

    # Make request to create wine
    response = requests.post(
        f"{API_BASE_URL}/wines",
        params={
            "name": test_name,
            "varietal": test_varietal,
            "vintage": test_vintage,
            "region": test_region,
            "price": test_price,
            "description": test_description
        }
    )

    # Assert response is successful
    assert response.status_code == 200

    # Assert response structure
    wine = response.json()
    assert "id" in wine
    assert "name" in wine
    assert "varietal" in wine
    assert "vintage" in wine
    assert "region" in wine
    assert "price" in wine
    assert "description" in wine
    assert "created_at" in wine
    assert wine["name"] == test_name
    assert wine["varietal"] == test_varietal
    assert wine["vintage"] == test_vintage
    assert wine["region"] == test_region
    assert wine["price"] == test_price
    assert wine["description"] == test_description


def test_create_wine_minimal():
    """Test POST /wines endpoint with minimal required fields"""
    # Test data with only required fields
    test_name = "Simple Wine"
    test_varietal = "Merlot"

    # Make request to create wine
    response = requests.post(
        f"{API_BASE_URL}/wines",
        params={
            "name": test_name,
            "varietal": test_varietal
        }
    )

    # Assert response is successful
    assert response.status_code == 200

    # Assert response structure
    wine = response.json()
    assert wine["name"] == test_name
    assert wine["varietal"] == test_varietal
    assert wine["vintage"] is None
    assert wine["region"] is None
    assert wine["price"] is None
    assert wine["description"] is None


def test_create_wine_validation():
    """Test POST /wines endpoint validation"""
    # Test empty name
    response = requests.post(
        f"{API_BASE_URL}/wines",
        params={"name": "", "varietal": "Cabernet"}
    )
    assert response.status_code == 400
    assert "Name is required" in response.json()["detail"]

    # Test empty varietal
    response = requests.post(
        f"{API_BASE_URL}/wines",
        params={"name": "Test Wine", "varietal": ""}
    )
    assert response.status_code == 400
    assert "Varietal is required" in response.json()["detail"]

    # Test invalid vintage (too old)
    response = requests.post(
        f"{API_BASE_URL}/wines",
        params={"name": "Test Wine", "varietal": "Merlot", "vintage": 1800}
    )
    assert response.status_code == 400
    assert "Invalid vintage year" in response.json()["detail"]

    # Test invalid vintage (too new)
    response = requests.post(
        f"{API_BASE_URL}/wines",
        params={"name": "Test Wine", "varietal": "Merlot", "vintage": 2200}
    )
    assert response.status_code == 400
    assert "Invalid vintage year" in response.json()["detail"]

    # Test negative price
    response = requests.post(
        f"{API_BASE_URL}/wines",
        params={"name": "Test Wine", "varietal": "Merlot", "price": -10.00}
    )
    assert response.status_code == 400
    assert "Price cannot be negative" in response.json()["detail"]

    # Test whitespace-only name
    response = requests.post(
        f"{API_BASE_URL}/wines",
        params={"name": "   ", "varietal": "Merlot"}
    )
    assert response.status_code == 400
    assert "Name is required" in response.json()["detail"]


def test_get_wine_by_id():
    """Test GET /wines/{wine_id} endpoint"""
    # First create a wine to test with
    create_response = requests.post(
        f"{API_BASE_URL}/wines",
        params={
            "name": "Test Wine for ID",
            "varietal": "Pinot Noir",
            "vintage": 2018,
            "region": "California"
        }
    )
    assert create_response.status_code == 200
    created_wine = create_response.json()
    wine_id = created_wine["id"]

    # Test getting the wine by ID
    response = requests.get(f"{API_BASE_URL}/wines/{wine_id}")
    assert response.status_code == 200

    wine = response.json()
    assert wine["id"] == wine_id
    assert wine["name"] == "Test Wine for ID"
    assert wine["varietal"] == "Pinot Noir"
    assert wine["vintage"] == 2018
    assert wine["region"] == "California"
    assert "created_at" in wine


def test_get_wine_by_id_validation():
    """Test GET /wines/{wine_id} endpoint validation"""
    # Test invalid wine ID (0)
    response = requests.get(f"{API_BASE_URL}/wines/0")
    assert response.status_code == 400
    assert "Invalid wine ID" in response.json()["detail"]

    # Test invalid wine ID (negative)
    response = requests.get(f"{API_BASE_URL}/wines/-1")
    assert response.status_code == 400
    assert "Invalid wine ID" in response.json()["detail"]

    # Test non-existent wine ID
    response = requests.get(f"{API_BASE_URL}/wines/99999")
    assert response.status_code == 404
    assert "Wine not found" in response.json()["detail"]


def test_update_wine():
    """Test PUT /wines/{wine_id} endpoint"""
    # First create a wine to update
    create_response = requests.post(
        f"{API_BASE_URL}/wines",
        params={
            "name": "Original Wine",
            "varietal": "Chardonnay",
            "vintage": 2019,
            "price": 25.00
        }
    )
    assert create_response.status_code == 200
    created_wine = create_response.json()
    wine_id = created_wine["id"]

    # Test updating name only
    response = requests.put(
        f"{API_BASE_URL}/wines/{wine_id}",
        params={"name": "Updated Wine Name"}
    )
    assert response.status_code == 200
    updated_wine = response.json()
    assert updated_wine["name"] == "Updated Wine Name"
    assert updated_wine["varietal"] == "Chardonnay"

    # Test updating price only
    response = requests.put(
        f"{API_BASE_URL}/wines/{wine_id}",
        params={"price": 35.00}
    )
    assert response.status_code == 200
    updated_wine = response.json()
    assert updated_wine["name"] == "Updated Wine Name"
    assert updated_wine["price"] == 35.00

    # Test updating multiple fields
    response = requests.put(
        f"{API_BASE_URL}/wines/{wine_id}",
        params={
            "name": "Final Wine Name",
            "vintage": 2020,
            "region": "Napa Valley",
            "description": "A beautiful wine"
        }
    )
    assert response.status_code == 200
    updated_wine = response.json()
    assert updated_wine["name"] == "Final Wine Name"
    assert updated_wine["vintage"] == 2020
    assert updated_wine["region"] == "Napa Valley"
    assert updated_wine["description"] == "A beautiful wine"


def test_update_wine_validation():
    """Test PUT /wines/{wine_id} endpoint validation"""
    # First create a wine to test with
    create_response = requests.post(
        f"{API_BASE_URL}/wines",
        params={"name": "Test Wine", "varietal": "Syrah"}
    )
    assert create_response.status_code == 200
    wine_id = create_response.json()["id"]

    # Test invalid wine ID (0)
    response = requests.put(
        f"{API_BASE_URL}/wines/0",
        params={"name": "Updated Name"}
    )
    assert response.status_code == 400
    assert "Invalid wine ID" in response.json()["detail"]

    # Test invalid wine ID (negative)
    response = requests.put(
        f"{API_BASE_URL}/wines/-1",
        params={"name": "Updated Name"}
    )
    assert response.status_code == 400
    assert "Invalid wine ID" in response.json()["detail"]

    # Test empty name
    response = requests.put(
        f"{API_BASE_URL}/wines/{wine_id}",
        params={"name": ""}
    )
    assert response.status_code == 400
    assert "Name cannot be empty" in response.json()["detail"]

    # Test empty varietal
    response = requests.put(
        f"{API_BASE_URL}/wines/{wine_id}",
        params={"varietal": ""}
    )
    assert response.status_code == 400
    assert "Varietal cannot be empty" in response.json()["detail"]

    # Test invalid vintage
    response = requests.put(
        f"{API_BASE_URL}/wines/{wine_id}",
        params={"vintage": 1800}
    )
    assert response.status_code == 400
    assert "Invalid vintage year" in response.json()["detail"]

    # Test negative price
    response = requests.put(
        f"{API_BASE_URL}/wines/{wine_id}",
        params={"price": -50.00}
    )
    assert response.status_code == 400
    assert "Price cannot be negative" in response.json()["detail"]

    # Test non-existent wine ID
    response = requests.put(
        f"{API_BASE_URL}/wines/99999",
        params={"name": "Updated Name"}
    )
    assert response.status_code == 404
    assert "Wine not found" in response.json()["detail"]


def test_delete_wine():
    """Test DELETE /wines/{wine_id} endpoint"""
    # First create a wine to delete
    create_response = requests.post(
        f"{API_BASE_URL}/wines",
        params={"name": "Wine to Delete", "varietal": "Tempranillo"}
    )
    assert create_response.status_code == 200
    created_wine = create_response.json()
    wine_id = created_wine["id"]

    # Test deleting the wine
    response = requests.delete(f"{API_BASE_URL}/wines/{wine_id}")
    assert response.status_code == 200

    delete_response = response.json()
    assert delete_response["message"] == "Wine deleted successfully"
    assert delete_response["wine_id"] == wine_id

    # Verify wine is actually deleted by trying to get it
    get_response = requests.get(f"{API_BASE_URL}/wines/{wine_id}")
    assert get_response.status_code == 404


def test_delete_wine_validation():
    """Test DELETE /wines/{wine_id} endpoint validation"""
    # Test invalid wine ID (0)
    response = requests.delete(f"{API_BASE_URL}/wines/0")
    assert response.status_code == 400
    assert "Invalid wine ID" in response.json()["detail"]

    # Test invalid wine ID (negative)
    response = requests.delete(f"{API_BASE_URL}/wines/-1")
    assert response.status_code == 400
    assert "Invalid wine ID" in response.json()["detail"]

    # Test non-existent wine ID
    response = requests.delete(f"{API_BASE_URL}/wines/99999")
    assert response.status_code == 404
    assert "Wine not found" in response.json()["detail"]

