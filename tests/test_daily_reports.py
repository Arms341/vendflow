"""
tests/test_daily_reports.py  v1.0.0
Locked template — JARVIS vending_machine gig.
"""
import logging
from typing import Dict
import pytest
from fastapi.testclient import TestClient

logger = logging.getLogger(__name__)


def _payload() -> dict:
    return {"machine_id": 1, "performance_score": 95.0, "status": "active"}


def test_create_daily_report(client: TestClient, auth_headers: Dict[str, str]) -> None:
    response = client.post("/daily_reports/", headers=auth_headers, json=_payload())
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    assert "id" in data


def test_get_daily_report(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/daily_reports/", headers=auth_headers, json=_payload()).json()
    response = client.get(f"/daily_reports/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_list_daily_reports(client: TestClient, auth_headers: Dict[str, str]) -> None:
    client.post("/daily_reports/", headers=auth_headers, json=_payload())
    response = client.get("/daily_reports/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_delete_daily_report(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/daily_reports/", headers=auth_headers, json=_payload()).json()
    response = client.delete(f"/daily_reports/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
