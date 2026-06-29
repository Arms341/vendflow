# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
from __future__ import annotations
"""
services/location_service.py
Emitted by backend_emit (Tier-A) — CRUD service for Location entity.
"""

from database import get_db
from fastapi import Depends
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.location import Location
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class LocationService:
    """Service layer for Location CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> Location:
        """Create."""
        row = Location(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[Location]:
        """List all."""
        result = self.db.execute(select(Location).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, location_id: int) -> Optional[Location]:
        """Get by id."""
        return self.db.get(Location, location_id)

    def update(self, location_id: int, data: dict) -> Optional[Location]:
        """Update."""
        row = self.db.get(Location, location_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, location_id: int) -> bool:
        """Delete."""
        row = self.db.get(Location, location_id)
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
def get_location_service(db: Session = Depends(get_db)) -> LocationService:
    """DI factory for LocationService."""
    return LocationService(db=db)
