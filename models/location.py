# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/location.py
Emitted by backend_emit (Tier-A) — ORM model for Location (locations table).
"""
import logging
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class Location(Base):
    """SQLAlchemy ORM model for the locations table."""

    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    operator_id = Column(Integer, ForeignKey("operators.id"), index=True, nullable=True)
    name = Column(String(255), nullable=False, server_default='')
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(50), nullable=True)
    zip_code = Column(String(20), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_type = Column(String(50), nullable=True)
    contact_name = Column(String(255), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<Location id={self.id}>"
