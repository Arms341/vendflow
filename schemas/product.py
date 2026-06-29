# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/product.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for Product entity.
Exports: ProductCreate, ProductUpdate, ProductResponse, ProductSchema (alias).
"""
from decimal import Decimal
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    """Shared writable fields for Product."""
    operator_id: Optional[int] = None
    name: str
    sku: Optional[str] = None
    category: Optional[str] = None
    unit_cost: Optional[Decimal] = None
    retail_price: Optional[Decimal] = None
    par_level: Optional[int] = 10
    image_url: Optional[str] = None
    is_active: Optional[bool] = True


class ProductCreate(ProductBase):
    """Schema for creating a Product."""
    id: Optional[int] = None
    pass


class ProductUpdate(BaseModel):
    """Schema for updating a Product. All fields optional."""
    id: Optional[int] = None
    operator_id: Optional[int] = None
    name: Optional[str] = None
    sku: Optional[str] = None
    category: Optional[str] = None
    unit_cost: Optional[Decimal] = None
    retail_price: Optional[Decimal] = None
    par_level: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


ProductSchema = ProductResponse
