# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
from __future__ import annotations
"""
services/service_visit_service.py
Emitted by backend_emit (Tier-A) — CRUD service for ServiceVisit entity.
"""

from database import get_db
from fastapi import Depends
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.service_visit import ServiceVisit
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class ServiceVisitService:
    """Service layer for ServiceVisit CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> ServiceVisit:
        """Create."""
        row = ServiceVisit(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[ServiceVisit]:
        """List all."""
        result = self.db.execute(select(ServiceVisit).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, service_visit_id: int) -> Optional[ServiceVisit]:
        """Get by id."""
        return self.db.get(ServiceVisit, service_visit_id)

    def update(self, service_visit_id: int, data: dict) -> Optional[ServiceVisit]:
        """Update."""
        row = self.db.get(ServiceVisit, service_visit_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, service_visit_id: int) -> bool:
        """Delete."""
        row = self.db.get(ServiceVisit, service_visit_id)
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
def get_service_visit_service(db: Session = Depends(get_db)) -> ServiceVisitService:
    """DI factory for ServiceVisitService."""
    return ServiceVisitService(db=db)
