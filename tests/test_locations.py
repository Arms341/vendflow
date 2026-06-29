"""
tests/test_locations.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD tests for Location entity.
NOTE: No exact count assertions — other tests create locations in shared DB.
"""
import logging
from typing import Dict

import pytest
from fastapi.testclient import TestClient

logger = logging.getLogger(__name__)


def test_create_location(client: TestClient, auth_headers: Dict[str, str]) -> None:
    """Test creating a new location via POST /locations/."""
    payload = {"name": "Test Location", "latitude": 40.7128, "longitude": -74.0060}
    response = client.post("/locations/", headers=auth_headers, json=payload)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    data = response.json()
    assert "id" in data
    assert data["name"] == payload["name"]
    assert data["latitude"] == payload["latitude"]
    assert data["longitude"] == payload["longitude"]


def test_get_location(client: TestClient, auth_headers: Dict[str, str]) -> None:
    """Test retrieving a location by ID via GET /locations/{id}."""
    payload = {"name": "Get Test", "latitude": 34.0522, "longitude": -118.2437}
    created = client.post("/locations/", headers=auth_headers, json=payload).json()
    location_id = created["id"]

    response = client.get(f"/locations/{location_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == location_id
    assert data["name"] == payload["name"]


def test_list_locations(client: TestClient, auth_headers: Dict[str, str]) -> None:
    """Test listing locations via GET /locations/."""
    # Create a location so at least one exists
    payload = {"name": "List Test", "latitude": 51.5074, "longitude": -0.1278}
    created = client.post("/locations/", headers=auth_headers, json=payload).json()

    response = client.get("/locations/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Use >= not == — other tests may have created locations in the same DB
    assert len(data) >= 1, f"Expected at least 1 location, got {len(data)}"

    # Verify our created location is in the list
    ids = {loc["id"] for loc in data}
    assert created["id"] in ids, "Created location not found in list"

    # Validate field structure
    for loc in data:
        assert "id" in loc
        assert "name" in loc
        assert isinstance(loc["id"], int)


def test_update_location(client: TestClient, auth_headers: Dict[str, str]) -> None:
    """Test updating a location via PUT /locations/{id}."""
    payload = {"name": "Original", "latitude": 40.7128, "longitude": -74.0060}
    created = client.post("/locations/", headers=auth_headers, json=payload).json()
    location_id = created["id"]

    update = {"name": "Updated", "latitude": 34.0522, "longitude": -118.2437}
    response = client.put(f"/locations/{location_id}", headers=auth_headers, json=update)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == location_id
    assert data["name"] == update["name"]
    assert data["latitude"] == update["latitude"]


def test_delete_location(client: TestClient, auth_headers: Dict[str, str]) -> None:
    """Test deleting a location via DELETE /locations/{id}."""
    payload = {"name": "Delete Test", "latitude": 40.7128, "longitude": -74.0060}
    created = client.post("/locations/", headers=auth_headers, json=payload).json()
    location_id = created["id"]

    response = client.delete(f"/locations/{location_id}", headers=auth_headers)
    assert response.status_code == 200

    # Confirm 404 after delete
    get_resp = client.get(f"/locations/{location_id}", headers=auth_headers)
    assert get_resp.status_code == 404


def test_get_location_not_found(client: TestClient, auth_headers: Dict[str, str]) -> None:
    """Test GET /locations/{id} returns 404 for non-existent ID."""
    response = client.get("/locations/999999", headers=auth_headers)
    assert response.status_code == 404
