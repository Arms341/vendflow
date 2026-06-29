# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/marketing_template.py
Emitted by backend_emit (Tier-A) — ORM model for MarketingTemplate (marketing_templates table).
"""
import logging
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class MarketingTemplate(Base):
    """SQLAlchemy ORM model for the marketing_templates table."""

    __tablename__ = "marketing_templates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, server_default='')
    category = Column(String(255), nullable=False, server_default='')
    template_type = Column(String(255), nullable=True)
    content_html = Column(Text, nullable=True)
    thumbnail_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, server_default='1', default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<MarketingTemplate id={self.id}>"
