# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
tests/test_inventories.py
Emitted by backend_emit (Tier-A) — CRUD smoke tests for InventoryItem.
"""
import logging
from typing import Dict
from fastapi.testclient import TestClient
import pytest
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


def test_create_inventory(client: TestClient, auth_headers: Dict[str, str]) -> None:
    """Test create inventory."""
    payload = {}
    response = client.post("/inventories/", headers=auth_headers, json=payload)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    assert "id" in response.json()


def test_get_inventory(client: TestClient, auth_headers: Dict[str, str]) -> None:
    """Test get inventory."""
    created = client.post("/inventories/", headers=auth_headers, json={}).json()
    response = client.get(f"/inventories/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_list_inventory(client: TestClient, auth_headers: Dict[str, str]) -> None:
    """Test list inventory."""
    client.post("/inventories/", headers=auth_headers, json={})
    response = client.get("/inventories/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_delete_inventory(client: TestClient, auth_headers: Dict[str, str]) -> None:
    """Test delete inventory."""
    created = client.post("/inventories/", headers=auth_headers, json={}).json()
    response = client.delete(f"/inventories/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert client.get(f"/inventories/{created['id']}", headers=auth_headers).status_code == 404