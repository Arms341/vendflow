# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/transaction.py
Emitted by backend_emit (Tier-A) — ORM model for Transaction (transactions table).
"""
import logging
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class Transaction(Base):
    """SQLAlchemy ORM model for the transactions table."""

    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), index=True, nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), index=True, nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(String(20), nullable=True)
    payment_status = Column(String(20), nullable=True)
    payment_ref = Column(String(255), nullable=True)
    card_brand = Column(String(20), nullable=True)
    card_last_four = Column(String(4), nullable=True)
    terminal_id = Column(String(100), nullable=True)
    slot_number = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<Transaction id={self.id}>"
