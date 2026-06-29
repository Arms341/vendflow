"""
tests/test_alerts.py
Locked template — JARVIS vending_machine gig.
Per VendFlow_FullStack_v2 §8. machine_id is a nullable FK so no parent seeding needed.
"""
import logging

import pytest

logger = logging.getLogger(__name__)


def test_create_alert(client, auth_headers):
    """POST /alerts/ with required fields -> 201."""
    payload = {
        "alert_type": "machine_offline",
        "severity": "high",
        "message": "Machine went offline",
    }
    response = client.post("/alerts/", json=payload, headers=auth_headers)
    assert response.status_code in (200, 201), (
        f"Expected 200/201, got {response.status_code}: {response.text[:300]}"
    )
    data = response.json()
    assert "id" in data
    assert data["alert_type"] == "machine_offline"


def test_list_alerts(client, auth_headers):
    """GET /alerts/ -> 200 list."""
    response = client.get("/alerts/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_alert_not_found(client, auth_headers):
    """GET nonexistent -> 404."""
    response = client.get("/alerts/99999", headers=auth_headers)
    assert response.status_code == 404
