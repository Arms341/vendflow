"""
services/user_service.py - Universal locked template v1.0.0
JARVIS Locked File Library - gig-agnostic (no gig_type).

Read-only User service that backs the universal SHADOWED-USERS-ROUTE
(routes/users.py: list + get-by-id only). The auth subsystem owns the user
entity - creation/login flow through /auth/register + /auth/login - so this
service intentionally exposes READ-ONLY access and depends ONLY on the
universal models.user.User model. It deliberately does NOT import schemas.user
(which is a per-gig template and may be an empty auto-stub in gigs that don't
ship one) and does NOT do password hashing.

Gigs that need full user CRUD (e.g. food_truck_pos) ship their own Tier-2
services/user_service.py, which the locked-template loader/restore prefers on a
gig match. This universal template is the gig-agnostic fallback that prevents
freelancing or cross-gig leakage of a wrong-gig user_service.
"""
import logging
from typing import List, Optional

from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.user import User

logger = logging.getLogger(__name__)


class UserService:
    """Read-only service layer for User (admin user listing)."""

    def __init__(self, db: Session = None):
        self.db = db

    def list_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Return a page of users."""
        result = self.db.execute(select(User).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, user_id: int) -> Optional[User]:
        """Return a single user by id, or None."""
        return self.db.get(User, user_id)

    # Method aliases - the route may call any of these names.
    list = list_all
    get_all = list_all
    get = get_by_id


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    """FastAPI dependency / factory: returns a read-only UserService with db injected."""
    return UserService(db)
