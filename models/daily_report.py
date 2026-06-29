# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/daily_report.py
Emitted by backend_emit (Tier-A) — ORM model for DailyReport (daily_reports table).
"""
import logging
from datetime import datetime
from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, Numeric

from models.base import Base

logger = logging.getLogger(__name__)


class DailyReport(Base):
    """SQLAlchemy ORM model for the daily_reports table."""

    __tablename__ = "daily_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), index=True, nullable=False)
    report_date = Column(Date, nullable=True)
    total_transactions = Column(Integer, default=0, nullable=True)
    total_revenue = Column(Numeric(12, 2), nullable=True)
    card_revenue = Column(Numeric(12, 2), nullable=True)
    cash_revenue = Column(Numeric(12, 2), nullable=True)
    items_sold = Column(Integer, default=0, nullable=True)
    avg_transaction = Column(Numeric(10, 2), nullable=True)
    uptime_hours = Column(Numeric(8, 2), nullable=True)
    alerts_count = Column(Integer, default=0, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<DailyReport id={self.id}>"
