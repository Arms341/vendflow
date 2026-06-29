# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/inventory.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for InventoryItem entity.
Exports: InventoryItemCreate, InventoryItemUpdate, InventoryItemResponse, InventoryItemSchema (alias).
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class InventoryItemBase(BaseModel):
    """Shared writable fields for InventoryItem."""
    machine_id: Optional[int] = None
    product_id: Optional[int] = None
    slot_number: Optional[int] = None
    current_qty: Optional[int] = 0
    max_qty: Optional[int] = None
    last_restocked_at: Optional[datetime] = None


class InventoryItemCreate(InventoryItemBase):
    """Schema for creating a InventoryItem."""
    id: Optional[int] = None
    pass


class InventoryItemUpdate(BaseModel):
    """Schema for updating a InventoryItem. All fields optional."""
    id: Optional[int] = None
    machine_id: Optional[int] = None
    product_id: Optional[int] = None
    slot_number: Optional[int] = None
    current_qty: Optional[int] = None
    max_qty: Optional[int] = None
    last_restocked_at: Optional[datetime] = None


class InventoryItemResponse(InventoryItemBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


InventoryItemSchema = InventoryItemResponse
