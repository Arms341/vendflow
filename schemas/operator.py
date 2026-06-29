# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/operator.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for Operator entity.
Exports: OperatorCreate, OperatorUpdate, OperatorResponse, OperatorSchema (alias).
"""
from decimal import Decimal
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class OperatorBase(BaseModel):
    """Shared writable fields for Operator."""
    name: str
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    machine_count: Optional[int] = 0
    monthly_volume: Optional[Decimal] = None
    processing_rate: Optional[Decimal] = 3.0
    software_rate: Optional[Decimal] = 9.0
    is_active: Optional[bool] = True


class OperatorCreate(OperatorBase):
    """Schema for creating a Operator."""
    id: Optional[int] = None
    pass


class OperatorUpdate(BaseModel):
    """Schema for updating a Operator. All fields optional."""
    id: Optional[int] = None
    name: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    machine_count: Optional[int] = None
    monthly_volume: Optional[Decimal] = None
    processing_rate: Optional[Decimal] = None
    software_rate: Optional[Decimal] = None
    is_active: Optional[bool] = None


class OperatorResponse(OperatorBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


OperatorSchema = OperatorResponse
