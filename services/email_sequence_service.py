"""
services/email_sequence_service.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD service for EmailSequence entity.
"""
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.email_sequence import EmailSequence

logger = logging.getLogger(__name__)


class EmailSequenceService:
    """Service layer for EmailSequence CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> EmailSequence:
        row = EmailSequence(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[EmailSequence]:
        result = self.db.execute(select(EmailSequence).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, row_id: int) -> Optional[EmailSequence]:
        return self.db.get(EmailSequence, row_id)

    def update(self, row_id: int, data: dict) -> Optional[EmailSequence]:
        row = self.db.get(EmailSequence, row_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, row_id: int) -> bool:
        row = self.db.get(EmailSequence, row_id)
        if not row:
            return False
        self.db.delete(row)
        self.db.commit()
        return True


def get_email_sequence_service(db: Session) -> EmailSequenceService:
    """DI factory for EmailSequenceService."""
    return EmailSequenceService(db=db)
