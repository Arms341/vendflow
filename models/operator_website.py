# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/operator_website.py
Emitted by backend_emit (Tier-A) — ORM model for OperatorWebsite (operator_websites table).
"""
import logging
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class OperatorWebsite(Base):
    """SQLAlchemy ORM model for the operator_websites table."""

    __tablename__ = "operator_websites"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    operator_id = Column(Integer, ForeignKey("operators.id"), index=True, nullable=True)
    domain = Column(String(255), nullable=True)
    subdomain = Column(String(255), nullable=True)
    company_name = Column(String(255), nullable=False, server_default='')
    tagline = Column(String(255), nullable=True)
    logo_url = Column(String(255), nullable=True)
    primary_color = Column(String(255), nullable=True)
    phone = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    about_text = Column(Text, nullable=True)
    services_json = Column(Text, nullable=True)
    chatbot_enabled = Column(Boolean, server_default='0', default=False, nullable=False)
    chatbot_greeting = Column(String(255), nullable=True)
    is_published = Column(Boolean, server_default='0', default=False, nullable=False)
    template_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<OperatorWebsite id={self.id}>"
