import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
def test_register_user(api_client):
    url = reverse("register")
    data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword123",
    }
    response = api_client.post(url, data, format="json")

    # Check if the response status is 201 Created
    assert response.status_code == 201
    assert "access" in response.data
    assert "refresh" in response.data

    # Verify user creation
    user = User.objects.filter(username="testuser").first()
    assert user is not None
    assert user.email == "testuser@example.com"


@pytest.mark.django_db
def test_register_existing_user(api_client):
    # Create a user first
    User.objects.create_user(
        username="existinguser", email="existing@example.com", password="testpassword"
    )

    url = reverse("register")
    data = {
        "username": "existinguser",
        "email": "existing@example.com",
        "password": "testpassword",
    }
    response = api_client.post(url, data, format="json")

    # Check if the response status is 400 Bad Request
    assert response.status_code == 400
    assert "username" in response.data


@pytest.mark.django_db
def test_login_user(api_client):
    # First, create a user
    user = User.objects.create_user(
        username="loginuser", email="loginuser@example.com", password="testpassword123"
    )

    url = reverse("login")
    data = {"username": "loginuser", "password": "testpassword123"}
    response = api_client.post(url, data, format="json")

    # Check if the response status is 200 OK and token is returned
    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data


@pytest.mark.django_db
def test_login_invalid_credentials(api_client):
    url = reverse("login")
    data = {"username": "nonexistentuser", "password": "wrongpassword"}
    response = api_client.post(url, data, format="json")

    # Check if the response status is 401 Unauthorized
    assert response.status_code == 401
    assert "access" not in response.data
