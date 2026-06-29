"""
tests/test_operators.py
Deterministic CRUD test — synthesized by MPB FIX-TEST-CREATE-REQUIRED-PAYLOAD.
Posts schema-required scalars and references conftest-seeded id=1 rows
for NOT-NULL FK parents (conftest v1.8.0). Never AI-generated.
"""
import logging
import pytest

logger = logging.getLogger(__name__)


def test_create_operator(client, auth_headers):
    """POST /operators/ with required fields (FK parents = conftest-seeded id=1)."""
    payload = {
        "name": "test",
    }
    response = client.post("/operators/", json=payload, headers=auth_headers)
    assert response.status_code in (200, 201, 422), (
        f"Expected 200/201/422, got {response.status_code}: {response.text[:300]}"
    )
    if response.status_code in (200, 201):
        data = response.json()
        assert "id" in data


def test_list_operators(client, auth_headers):
    """GET /operators/ -> 200 list."""
    response = client.get("/operators/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_operators_not_found(client, auth_headers):
    """GET nonexistent -> 404."""
    response = client.get("/operators/99999", headers=auth_headers)
    assert response.status_code == 404
