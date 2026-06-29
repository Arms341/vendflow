"""
tests/test_users.py  v2.0.0
Universal locked template — JARVIS gig-agnostic (no gig_type).

Read-only CRUD smoke tests for the universal User entity (admin user listing).
Pairs with the universal read-only services/user_service.py + routes/users.py
(list + get-by-id only); user creation/login flow through /auth/register +
/auth/login, so this template deliberately tests only list + 404 and never
references TestClient (client is annotated Any) — gig-agnostic and safe for
every build. Gigs that ship a Tier-2 tests/test_users.py (e.g. food_truck_pos)
have it preferred by the loader on a gig match.

v2.0.0: Read-only smoke tests — backed by locked model + service + route.
"""
import logging
from typing import Any

logger = logging.getLogger(__name__)


def test_list_users(client: Any, auth_headers: Any) -> None:
    """GET /users/ -> 200 list."""
    response = client.get("/users/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_user_not_found(client: Any, auth_headers: Any) -> None:
    """GET /users/999999 -> 404."""
    response = client.get("/users/999999", headers=auth_headers)
    assert response.status_code == 404
