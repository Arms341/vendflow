# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/lead.py
Emitted by backend_emit (Tier-A) — ORM model for Lead (leads table).
"""
import logging
from datetime import datetime
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class Lead(Base):
    """SQLAlchemy ORM model for the leads table."""

    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    operator_id = Column(Integer, ForeignKey("operators.id"), index=True, nullable=True)
    business_name = Column(String(255), nullable=False, server_default='')
    contact_name = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=True)
    contact_phone = Column(String(255), nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    state = Column(String(255), nullable=True)
    zip_code = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    business_type = Column(String(255), nullable=True)
    status = Column(String(255), nullable=False, server_default='')
    source = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    next_follow_up_at = Column(DateTime, nullable=True)
    mockup_image_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<Lead id={self.id}>"
