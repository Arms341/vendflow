"""
services/daily_report_service.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD service for DailyReport entity.
"""
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.daily_report import DailyReport

logger = logging.getLogger(__name__)


class DailyReportService:
    """Service layer for DailyReport CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> DailyReport:
        row = DailyReport(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[DailyReport]:
        result = self.db.execute(select(DailyReport).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, row_id: int) -> Optional[DailyReport]:
        return self.db.get(DailyReport, row_id)

    def update(self, row_id: int, data: dict) -> Optional[DailyReport]:
        row = self.db.get(DailyReport, row_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, row_id: int) -> bool:
        row = self.db.get(DailyReport, row_id)
        if not row:
            return False
        self.db.delete(row)
        self.db.commit()
        return True


def get_daily_report_service(db: Session) -> DailyReportService:
    """DI factory for DailyReportService."""
    return DailyReportService(db=db)
