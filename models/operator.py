# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/operator.py
Emitted by backend_emit (Tier-A) — ORM model for Operator (operators table).
"""
import logging
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, Numeric, String

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class Operator(Base):
    """SQLAlchemy ORM model for the operators table."""

    __tablename__ = "operators"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, server_default='')
    contact_name = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(50), nullable=True)
    zip_code = Column(String(20), nullable=True)
    machine_count = Column(Integer, default=0, nullable=True)
    monthly_volume = Column(Numeric(14, 2), nullable=True)
    processing_rate = Column(Numeric(5, 2), default=3.0, nullable=True)
    software_rate = Column(Numeric(6, 2), default=9.0, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<Operator id={self.id}>"
