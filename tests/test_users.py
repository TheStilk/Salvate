import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_current_user():
    # First login to get token
    login_response = client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpass"}
    )
    token = login_response.json()["access_token"]
    
    response = client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert "id" in response.json()
    assert "username" in response.json()

def test_update_user():
    login_response = client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpass"}
    )
    token = login_response.json()["access_token"]
    
    response = client.put(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"},
        json={"full_name": "Updated Name"}
    )
    assert response.status_code == 200
    assert response.json()["full_name"] == "Updated Name"

def test_change_password():
    login_response = client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpass"}
    )
    token = login_response.json()["access_token"]
    
    response = client.put(
        "/api/users/me/password",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "current_password": "testpass",
            "new_password": "newpass"
        }
    )
    assert response.status_code == 200 