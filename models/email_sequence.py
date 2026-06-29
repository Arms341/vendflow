# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/email_sequence.py
Emitted by backend_emit (Tier-A) — ORM model for EmailSequence (email_sequences table).
"""
import logging
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class EmailSequence(Base):
    """SQLAlchemy ORM model for the email_sequences table."""

    __tablename__ = "email_sequences"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    operator_id = Column(Integer, ForeignKey("operators.id"), index=True, nullable=True)
    name = Column(String(255), nullable=False, server_default='')
    trigger_status = Column(String(255), nullable=True)
    steps_json = Column(Text, nullable=True)
    is_active = Column(Boolean, server_default='1', default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<EmailSequence id={self.id}>"
