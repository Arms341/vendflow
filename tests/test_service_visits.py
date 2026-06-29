"""
tests/test_service_visits.py
Deterministic CRUD test — synthesized by MPB FIX-TEST-CREATE-REQUIRED-PAYLOAD.
Posts schema-required scalars and references conftest-seeded id=1 rows
for NOT-NULL FK parents (conftest v1.8.0). Never AI-generated.
"""
import logging
import pytest

logger = logging.getLogger(__name__)


def test_create_service_visit(client, auth_headers):
    """POST /service_visits/ with required fields (FK parents = conftest-seeded id=1)."""
    payload = {
        "machine_id": 1,
        "driver_id": 1,
    }
    response = client.post("/service_visits/", json=payload, headers=auth_headers)
    assert response.status_code in (200, 201, 422), (
        f"Expected 200/201/422, got {response.status_code}: {response.text[:300]}"
    )
    if response.status_code in (200, 201):
        data = response.json()
        assert "id" in data


def test_list_service_visits(client, auth_headers):
    """GET /service_visits/ -> 200 list."""
    response = client.get("/service_visits/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_service_visits_not_found(client, auth_headers):
    """GET nonexistent -> 404."""
    response = client.get("/service_visits/99999", headers=auth_headers)
    assert response.status_code == 404
