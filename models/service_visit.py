# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/service_visit.py
Emitted by backend_emit (Tier-A) — ORM model for ServiceVisit (service_visits table).
"""
import logging
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class ServiceVisit(Base):
    """SQLAlchemy ORM model for the service_visits table."""

    __tablename__ = "service_visits"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), index=True, nullable=False)
    driver_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), index=True, nullable=True)
    visit_type = Column(String(30), nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    cash_collected = Column(Numeric(10, 2), default=0, nullable=True)
    products_restocked_json = Column(Text, nullable=True)
    issues_found_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<ServiceVisit id={self.id}>"
