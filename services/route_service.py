# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
from __future__ import annotations
"""
services/route_service.py
Emitted by backend_emit (Tier-A) — CRUD service for Route entity.
"""

from database import get_db
from fastapi import Depends
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.route import Route
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class RouteService:
    """Service layer for Route CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> Route:
        """Create."""
        row = Route(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[Route]:
        """List all."""
        result = self.db.execute(select(Route).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, route_id: int) -> Optional[Route]:
        """Get by id."""
        return self.db.get(Route, route_id)

    def update(self, route_id: int, data: dict) -> Optional[Route]:
        """Update."""
        row = self.db.get(Route, route_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, route_id: int) -> bool:
        """Delete."""
        row = self.db.get(Route, route_id)
        if not row:
            return False
        self.db.delete(row)
        self.db.commit()
        return True



    list = list_all  # FIX-SERVICE-METHOD-ALIAS: route may call .list()
    get_all = list_all  # FIX-SERVICE-METHOD-ALIAS: route may call .get_all()
    get = get_by_id  # FIX-SERVICE-METHOD-ALIAS: route may call .get()

    # FIX-SERVICE-GET-LIST-ALIAS: route calls get_all() but method is list_all()
    get_all = list_all

    # FIX-SERVICE-GET-LIST-ALIAS: route calls get_all() but method is list_all()
    get_all = list_all
def get_route_service(db: Session = Depends(get_db)) -> RouteService:
    """DI factory for RouteService."""
    return RouteService(db=db)
