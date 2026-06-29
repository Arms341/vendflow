"""
services/marketing_template_service.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD service for MarketingTemplate entity.
"""
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.marketing_template import MarketingTemplate

logger = logging.getLogger(__name__)


class MarketingTemplateService:
    """Service layer for MarketingTemplate CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> MarketingTemplate:
        row = MarketingTemplate(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[MarketingTemplate]:
        result = self.db.execute(select(MarketingTemplate).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, row_id: int) -> Optional[MarketingTemplate]:
        return self.db.get(MarketingTemplate, row_id)

    def update(self, row_id: int, data: dict) -> Optional[MarketingTemplate]:
        row = self.db.get(MarketingTemplate, row_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, row_id: int) -> bool:
        row = self.db.get(MarketingTemplate, row_id)
        if not row:
            return False
        self.db.delete(row)
        self.db.commit()
        return True


def get_marketing_template_service(db: Session) -> MarketingTemplateService:
    """DI factory for MarketingTemplateService."""
    return MarketingTemplateService(db=db)
