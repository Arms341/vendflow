"""
services/operator_website_service.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD service for OperatorWebsite entity.
"""
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.operator_website import OperatorWebsite

logger = logging.getLogger(__name__)


class OperatorWebsiteService:
    """Service layer for OperatorWebsite CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> OperatorWebsite:
        row = OperatorWebsite(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[OperatorWebsite]:
        result = self.db.execute(select(OperatorWebsite).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, row_id: int) -> Optional[OperatorWebsite]:
        return self.db.get(OperatorWebsite, row_id)

    def update(self, row_id: int, data: dict) -> Optional[OperatorWebsite]:
        row = self.db.get(OperatorWebsite, row_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, row_id: int) -> bool:
        row = self.db.get(OperatorWebsite, row_id)
        if not row:
            return False
        self.db.delete(row)
        self.db.commit()
        return True


def get_operator_website_service(db: Session) -> OperatorWebsiteService:
    """DI factory for OperatorWebsiteService."""
    return OperatorWebsiteService(db=db)
