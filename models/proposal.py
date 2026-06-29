# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/proposal.py
Emitted by backend_emit (Tier-A) — ORM model for Proposal (proposals table).
"""
import logging
from datetime import datetime
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, Numeric, String, Text

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class Proposal(Base):
    """SQLAlchemy ORM model for the proposals table."""

    __tablename__ = "proposals"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), index=True, nullable=True)
    operator_id = Column(Integer, ForeignKey("operators.id"), index=True, nullable=True)
    title = Column(String(255), nullable=False, server_default='')
    description = Column(Text, nullable=True)
    machine_type = Column(String(255), nullable=True)
    machine_count = Column(Integer, nullable=True)
    monthly_revenue_estimate = Column(Numeric(10, 2), nullable=True)
    commission_split = Column(Numeric(10, 2), nullable=True)
    placement_fee = Column(Numeric(10, 2), nullable=True)
    contract_term_months = Column(Integer, nullable=True)
    status = Column(String(255), nullable=False, server_default='')
    sent_at = Column(DateTime, nullable=True)
    viewed_at = Column(DateTime, nullable=True)
    signed_at = Column(DateTime, nullable=True)
    signature_data = Column(Text, nullable=True)
    pdf_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<Proposal id={self.id}>"
