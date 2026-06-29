# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/email_send_log.py
Emitted by backend_emit (Tier-A) — ORM model for EmailSendLog (email_send_logs table).
"""
import logging
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class EmailSendLog(Base):
    """SQLAlchemy ORM model for the email_send_logs table."""

    __tablename__ = "email_send_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), index=True, nullable=True)
    sequence_id = Column(Integer, ForeignKey("email_sequences.id"), index=True, nullable=True)
    step_number = Column(Integer, server_default='0', default=0, nullable=False)
    subject = Column(String(255), nullable=True)
    status = Column(String(255), nullable=False, server_default='')
    sent_at = Column(DateTime, nullable=True)
    opened_at = Column(DateTime, nullable=True)
    clicked_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<EmailSendLog id={self.id}>"
