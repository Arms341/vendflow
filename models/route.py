# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/route.py
Emitted by backend_emit (Tier-A) — ORM model for Route (routes table).
"""
import logging
from datetime import datetime
from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, Numeric, String, Text

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class Route(Base):
    """SQLAlchemy ORM model for the routes table."""

    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    operator_id = Column(Integer, ForeignKey("operators.id"), index=True, nullable=False)
    driver_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=True)
    name = Column(String(255), nullable=False, server_default='')
    status = Column(String(20), server_default='planned', nullable=False)
    scheduled_date = Column(Date, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    machine_ids_json = Column(Text, nullable=True)
    optimized_order_json = Column(Text, nullable=True)
    total_distance_miles = Column(Numeric(10, 2), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<Route id={self.id}>"
