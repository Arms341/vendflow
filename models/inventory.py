# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/inventory.py
Emitted by backend_emit (Tier-A) — ORM model for InventoryItem (inventories table).
"""
import logging
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class InventoryItem(Base):
    """SQLAlchemy ORM model for the inventories table."""

    __tablename__ = "inventories"

    __table_args__ = (
        UniqueConstraint("machine_id", "slot_number", name="uq_inventory_machine_slot"),
    )

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), index=True, nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), index=True, nullable=True)
    slot_number = Column(Integer, nullable=True)
    current_qty = Column(Integer, server_default='0', default=0, nullable=False)
    max_qty = Column(Integer, nullable=True)
    last_restocked_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<InventoryItem id={self.id}>"
