"""
tests/test_email_send_logs.py  v1.0.0
Locked template — JARVIS vending_machine gig.
"""
import logging
from typing import Dict
import pytest
from fastapi.testclient import TestClient

logger = logging.getLogger(__name__)


def _payload() -> dict:
    return {"step_number": 1, "status": "new"}


def test_create_email_send_log(client: TestClient, auth_headers: Dict[str, str]) -> None:
    response = client.post("/email_send_logs/", headers=auth_headers, json=_payload())
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert "id" in data


def test_get_email_send_log(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/email_send_logs/", headers=auth_headers, json=_payload()).json()
    response = client.get(f"/email_send_logs/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_list_email_send_logs(client: TestClient, auth_headers: Dict[str, str]) -> None:
    client.post("/email_send_logs/", headers=auth_headers, json=_payload())
    response = client.get("/email_send_logs/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_delete_email_send_log(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/email_send_logs/", headers=auth_headers, json=_payload()).json()
    response = client.delete(f"/email_send_logs/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
