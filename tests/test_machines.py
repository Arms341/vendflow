"""
tests/test_machines.py  v1.0.0
Locked template — JARVIS vending_machine gig.
"""
import logging
from typing import Dict
import pytest
from fastapi.testclient import TestClient

logger = logging.getLogger(__name__)

def test_create_machine(client: TestClient, auth_headers: Dict[str, str]) -> None:
    payload = {"serial_number": "VM-TEST-001", "machine_type": "combo", "status": "active"}
    response = client.post("/machines/", headers=auth_headers, json=payload)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    data = response.json()
    assert "id" in data
    assert data["serial_number"] == payload["serial_number"]

def test_get_machine(client: TestClient, auth_headers: Dict[str, str]) -> None:
    payload = {"serial_number": "VM-GET-001", "machine_type": "snack", "status": "active"}
    created = client.post("/machines/", headers=auth_headers, json=payload).json()
    response = client.get(f"/machines/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]

def test_list_machines(client: TestClient, auth_headers: Dict[str, str]) -> None:
    client.post("/machines/", headers=auth_headers, json={"serial_number": "VM-LIST-001", "machine_type": "drink", "status": "active"})
    response = client.get("/machines/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_delete_machine(client: TestClient, auth_headers: Dict[str, str]) -> None:
    created = client.post("/machines/", headers=auth_headers, json={"serial_number": "VM-DEL-001", "machine_type": "combo", "status": "active"}).json()
    response = client.delete(f"/machines/{created['id']}", headers=auth_headers)
    assert response.status_code == 200
    assert client.get(f"/machines/{created['id']}", headers=auth_headers).status_code == 404
