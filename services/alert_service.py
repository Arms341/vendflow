# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
from __future__ import annotations
"""
services/alert_service.py
Emitted by backend_emit (Tier-A) — CRUD service for Alert entity.
"""

from database import get_db
from fastapi import Depends
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.alert import Alert
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class AlertService:
    """Service layer for Alert CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> Alert:
        """Create."""
        row = Alert(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[Alert]:
        """List all."""
        result = self.db.execute(select(Alert).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, alert_id: int) -> Optional[Alert]:
        """Get by id."""
        return self.db.get(Alert, alert_id)

    def update(self, alert_id: int, data: dict) -> Optional[Alert]:
        """Update."""
        row = self.db.get(Alert, alert_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, alert_id: int) -> bool:
        """Delete."""
        row = self.db.get(Alert, alert_id)
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
def get_alert_service(db: Session = Depends(get_db)) -> AlertService:
    """DI factory for AlertService."""
    return AlertService(db=db)
