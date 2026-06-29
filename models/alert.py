# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/alert.py
Emitted by backend_emit (Tier-A) — ORM model for Alert (alerts table).
"""
import logging
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class Alert(Base):
    """SQLAlchemy ORM model for the alerts table."""

    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), index=True, nullable=True)
    alert_type = Column(String(50), nullable=False, server_default='')
    severity = Column(String(20), server_default='medium', nullable=False)
    message = Column(Text, nullable=False, server_default='')
    is_acknowledged = Column(Boolean, default=False, nullable=False)
    acknowledged_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    data_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<Alert id={self.id}>"
