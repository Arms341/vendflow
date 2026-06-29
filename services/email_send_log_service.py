"""
services/email_send_log_service.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD service for EmailSendLog entity.
"""
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.email_send_log import EmailSendLog

logger = logging.getLogger(__name__)


class EmailSendLogService:
    """Service layer for EmailSendLog CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> EmailSendLog:
        row = EmailSendLog(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[EmailSendLog]:
        result = self.db.execute(select(EmailSendLog).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, row_id: int) -> Optional[EmailSendLog]:
        return self.db.get(EmailSendLog, row_id)

    def update(self, row_id: int, data: dict) -> Optional[EmailSendLog]:
        row = self.db.get(EmailSendLog, row_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, row_id: int) -> bool:
        row = self.db.get(EmailSendLog, row_id)
        if not row:
            return False
        self.db.delete(row)
        self.db.commit()
        return True


def get_email_send_log_service(db: Session) -> EmailSendLogService:
    """DI factory for EmailSendLogService."""
    return EmailSendLogService(db=db)
