# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/lead.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for Lead entity.
Exports: LeadCreate, LeadUpdate, LeadResponse, LeadSchema (alias).
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class LeadBase(BaseModel):
    """Shared writable fields for Lead."""
    operator_id: Optional[int] = None
    business_name: str
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    business_type: Optional[str] = None
    status: str
    source: Optional[str] = None
    notes: Optional[str] = None
    next_follow_up_at: Optional[datetime] = None
    mockup_image_url: Optional[str] = None


class LeadCreate(LeadBase):
    """Schema for creating a Lead."""
    id: Optional[int] = None
    pass


class LeadUpdate(BaseModel):
    """Schema for updating a Lead. All fields optional."""
    id: Optional[int] = None
    operator_id: Optional[int] = None
    business_name: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    business_type: Optional[str] = None
    status: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None
    next_follow_up_at: Optional[datetime] = None
    mockup_image_url: Optional[str] = None


class LeadResponse(LeadBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


LeadSchema = LeadResponse
