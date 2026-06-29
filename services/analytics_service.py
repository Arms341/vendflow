"""
services/analytics_service.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD service for Analytics entity. Mirrors locked lead_service convention:
db held on the instance (self.db), get_analytics_service(db) DI factory.
"""
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.analytics import Analytics

logger = logging.getLogger(__name__)


class AnalyticsService:
    """Service layer for Analytics CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> Analytics:
        row = Analytics(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[Analytics]:
        result = self.db.execute(select(Analytics).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, row_id: int) -> Optional[Analytics]:
        return self.db.get(Analytics, row_id)

    def update(self, row_id: int, data: dict) -> Optional[Analytics]:
        row = self.db.get(Analytics, row_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, row_id: int) -> bool:
        row = self.db.get(Analytics, row_id)
        if not row:
            return False
        self.db.delete(row)
        self.db.commit()
        return True


def get_analytics_service(db: Session) -> AnalyticsService:
    """DI factory for AnalyticsService."""
    return AnalyticsService(db=db)
