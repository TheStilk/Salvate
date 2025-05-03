import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_subscription():
    login_response = client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpass"}
    )
    token = login_response.json()["access_token"]
    
    response = client.post(
        "/api/subscriptions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Test Subscription",
            "description": "Test Description",
            "price": 9.99,
            "duration_days": 30,
            "features": ["Feature 1", "Feature 2"]
        }
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Subscription"

def test_get_subscriptions():
    login_response = client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpass"}
    )
    token = login_response.json()["access_token"]
    
    response = client.get(
        "/api/subscriptions",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_subscription():
    login_response = client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpass"}
    )
    token = login_response.json()["access_token"]
    
    # First create a subscription
    create_response = client.post(
        "/api/subscriptions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Test Subscription",
            "description": "Test Description",
            "price": 9.99,
            "duration_days": 30,
            "features": ["Feature 1", "Feature 2"]
        }
    )
    subscription_id = create_response.json()["id"]
    
    # Then update it
    response = client.put(
        f"/api/subscriptions/{subscription_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "price": 19.99,
            "features": ["Feature 1", "Feature 2", "Feature 3"]
        }
    )
    assert response.status_code == 200
    assert response.json()["price"] == 19.99
    assert len(response.json()["features"]) == 3 