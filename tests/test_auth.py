import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login_success():
    response = client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpass"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_invalid_credentials():
    response = client.post(
        "/api/auth/login",
        data={"username": "wronguser", "password": "wrongpass"}
    )
    assert response.status_code == 401

def test_register_success():
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "newpass",
            "full_name": "New User"
        }
    )
    assert response.status_code == 200
    assert "id" in response.json()

def test_register_duplicate_username():
    response = client.post(
        "/api/auth/register",
        json={
            "email": "existing@example.com",
            "username": "testuser",
            "password": "testpass",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 400 