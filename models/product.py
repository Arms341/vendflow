# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/product.py
Emitted by backend_emit (Tier-A) — ORM model for Product (products table).
"""
import logging
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String

from models.base import Base

logger = logging.getLogger(__name__)


class Product(Base):
    """SQLAlchemy ORM model for the products table."""

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    operator_id = Column(Integer, ForeignKey("operators.id"), index=True, nullable=True)
    name = Column(String(255), nullable=False)
    sku = Column(String(100), nullable=True)
    category = Column(String(50), nullable=True)
    unit_cost = Column(Numeric(10, 2), nullable=True)
    retail_price = Column(Numeric(10, 2), nullable=True)
    par_level = Column(Integer, default=10, nullable=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<Product id={self.id}>"
