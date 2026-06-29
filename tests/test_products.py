"""
tests/test_products.py  v1.0.0
Locked template — JARVIS vending_machine gig.
"""
import logging
from typing import Dict
import pytest
from fastapi.testclient import TestClient

logger = logging.getLogger(__name__)

def test_create_product(client: TestClient, auth_headers: Dict[str, str]) -> None:
    payload = {"name": "Test Soda", "description": "Cola 12oz", "price": 1.50}
    response = client.post("/products/", headers=auth_headers, json=payload)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    data = response.json()
    assert "id" in data
    assert data["name"] == payload["name"]

def test_list_products(client: TestClient, auth_headers: Dict[str, str]) -> None:
    client.post("/products/", headers=auth_headers, json={"name": "Chips", "price": 2.00})
    response = client.get("/products/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1

def test_get_product(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/products/", headers=auth_headers, json={"name": "Water", "price": 1.00}).json()
    response = client.get(f"/products/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]

def test_delete_product(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/products/", headers=auth_headers, json={"name": "Delete Me", "price": 0.50}).json()
    response = client.delete(f"/products/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert client.get(f"/products/{created['id']}", headers=auth_headers).status_code == 404
