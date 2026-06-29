"""
tests/test_operator_websites.py  v1.0.0
Locked template — JARVIS vending_machine gig.
"""
import logging
from typing import Dict
import pytest
from fastapi.testclient import TestClient

logger = logging.getLogger(__name__)


def _payload() -> dict:
    return {"company_name": "Test company_name", "is_published": True}


def test_create_operator_website(client: TestClient, auth_headers: Dict[str, str]) -> None:
    response = client.post("/operator_websites/", headers=auth_headers, json=_payload())
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert "id" in data


def test_get_operator_website(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/operator_websites/", headers=auth_headers, json=_payload()).json()
    response = client.get(f"/operator_websites/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_list_operator_websites(client: TestClient, auth_headers: Dict[str, str]) -> None:
    client.post("/operator_websites/", headers=auth_headers, json=_payload())
    response = client.get("/operator_websites/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_delete_operator_website(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/operator_websites/", headers=auth_headers, json=_payload()).json()
    response = client.delete(f"/operator_websites/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
