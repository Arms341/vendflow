"""
tests/test_proposals.py  v1.0.0
Locked template — JARVIS vending_machine gig.
"""
import logging
from typing import Dict
import pytest
from fastapi.testclient import TestClient

logger = logging.getLogger(__name__)


def _payload() -> dict:
    return {"title": "Test title", "status": "new"}


def test_create_proposal(client: TestClient, auth_headers: Dict[str, str]) -> None:
    response = client.post("/proposals/", headers=auth_headers, json=_payload())
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert "id" in data


def test_get_proposal(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/proposals/", headers=auth_headers, json=_payload()).json()
    response = client.get(f"/proposals/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_list_proposals(client: TestClient, auth_headers: Dict[str, str]) -> None:
    client.post("/proposals/", headers=auth_headers, json=_payload())
    response = client.get("/proposals/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_delete_proposal(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/proposals/", headers=auth_headers, json=_payload()).json()
    response = client.delete(f"/proposals/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
