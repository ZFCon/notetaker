import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient

from notes.models import Note


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_user(db):
    return User.objects.create_user(username="testuser", password="password123")


@pytest.mark.django_db
def test_create_note_authenticated(api_client, create_user):
    api_client.force_authenticate(user=create_user)
    url = reverse("note-list")
    data = {"title": "Sample Note", "description": "This is a test note."}
    response = api_client.post(url, data, format="json")
    assert response.status_code == 201
    assert response.data["title"] == "Sample Note"
    assert response.data["description"] == "This is a test note."


@pytest.mark.django_db
def test_list_notes_authenticated(api_client, create_user):
    Note.objects.create(user=create_user, title="Note 1", description="Description 1")
    Note.objects.create(user=create_user, title="Note 2", description="Description 2")

    api_client.force_authenticate(user=create_user)
    url = reverse("note-list")
    response = api_client.get(url, format="json")
    assert response.status_code == 200
    assert len(response.data) == 2


@pytest.mark.django_db
def test_update_note_authenticated(api_client, create_user):
    note = Note.objects.create(
        user=create_user, title="Old Title", description="Old Description"
    )
    api_client.force_authenticate(user=create_user)
    url = reverse("note-detail", kwargs={"pk": note.id})
    data = {"title": "Updated Title", "description": "Updated Description"}
    response = api_client.put(url, data, format="json")
    assert response.status_code == 200
    assert response.data["title"] == "Updated Title"
    assert response.data["description"] == "Updated Description"


@pytest.mark.django_db
def test_delete_note_authenticated(api_client, create_user):
    note = Note.objects.create(
        user=create_user, title="Delete Title", description="Delete Description"
    )
    api_client.force_authenticate(user=create_user)
    url = reverse("note-detail", kwargs={"pk": note.id})
    response = api_client.delete(url)
    assert response.status_code == 204
    assert Note.objects.filter(id=note.id).exists() is False
