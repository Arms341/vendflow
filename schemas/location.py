# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/location.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for Location entity.
Exports: LocationCreate, LocationUpdate, LocationResponse, LocationSchema (alias).
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class LocationBase(BaseModel):
    """Shared writable fields for Location."""
    operator_id: Optional[int] = None
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_type: Optional[str] = None
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = True


class LocationCreate(LocationBase):
    """Schema for creating a Location."""
    id: Optional[int] = None
    pass


class LocationUpdate(BaseModel):
    """Schema for updating a Location. All fields optional."""
    id: Optional[int] = None
    operator_id: Optional[int] = None
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_type: Optional[str] = None
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None


class LocationResponse(LocationBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


LocationSchema = LocationResponse
