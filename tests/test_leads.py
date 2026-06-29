"""
tests/test_leads.py  v1.0.0
Locked template — JARVIS vending_machine gig.
"""
import logging
from typing import Dict
import pytest
from fastapi.testclient import TestClient

logger = logging.getLogger(__name__)


def _payload() -> dict:
    return {"business_name": "Test business_name", "status": "new"}


def test_create_lead(client: TestClient, auth_headers: Dict[str, str]) -> None:
    response = client.post("/leads/", headers=auth_headers, json=_payload())
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert "id" in data


def test_get_lead(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/leads/", headers=auth_headers, json=_payload()).json()
    response = client.get(f"/leads/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_list_leads(client: TestClient, auth_headers: Dict[str, str]) -> None:
    client.post("/leads/", headers=auth_headers, json=_payload())
    response = client.get("/leads/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_delete_lead(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/leads/", headers=auth_headers, json=_payload()).json()
    response = client.delete(f"/leads/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
