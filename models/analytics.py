# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/analytics.py
Emitted by backend_emit (Tier-A) — ORM model for Analytics (analytics table).
"""
import logging
from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, Text

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class Analytics(Base):
    """SQLAlchemy ORM model for the analytics table."""

    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False, server_default='')
    description = Column(Text, nullable=True)
    status = Column(String(255), server_default='active', nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<Analytics id={self.id}>"
