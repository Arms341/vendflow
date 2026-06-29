"""
tests/test_marketing_templates.py  v1.0.0
Locked template — JARVIS vending_machine gig.
"""
import logging
from typing import Dict
import pytest
from fastapi.testclient import TestClient

logger = logging.getLogger(__name__)


def _payload() -> dict:
    return {"name": "Test name", "category": "Test category", "is_active": True}


def test_create_marketing_template(client: TestClient, auth_headers: Dict[str, str]) -> None:
    response = client.post("/marketing_templates/", headers=auth_headers, json=_payload())
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert "id" in data


def test_get_marketing_template(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/marketing_templates/", headers=auth_headers, json=_payload()).json()
    response = client.get(f"/marketing_templates/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_list_marketing_templates(client: TestClient, auth_headers: Dict[str, str]) -> None:
    client.post("/marketing_templates/", headers=auth_headers, json=_payload())
    response = client.get("/marketing_templates/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_delete_marketing_template(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/marketing_templates/", headers=auth_headers, json=_payload()).json()
    response = client.delete(f"/marketing_templates/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
