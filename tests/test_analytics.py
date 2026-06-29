"""
tests/test_analytics.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD tests for Analytics. No exact-count assertions (test isolation safe).
"""
import logging
from typing import Dict
import pytest
from fastapi.testclient import TestClient

logger = logging.getLogger(__name__)


def _payload() -> dict:
    return {"title": "Test analytics", "status": "active"}


def test_create_analytic(client: TestClient, auth_headers: Dict[str, str]) -> None:
    response = client.post("/analytics/", headers=auth_headers, json=_payload())
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert "id" in data


def test_get_analytic(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/analytics/", headers=auth_headers, json=_payload()).json()
    response = client.get(f"/analytics/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_list_analytics(client: TestClient, auth_headers: Dict[str, str]) -> None:
    client.post("/analytics/", headers=auth_headers, json=_payload())
    response = client.get("/analytics/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_delete_analytic(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/analytics/", headers=auth_headers, json=_payload()).json()
    response = client.delete(f"/analytics/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
