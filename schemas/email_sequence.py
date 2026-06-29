# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/email_sequence.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for EmailSequence entity.
Exports: EmailSequenceCreate, EmailSequenceUpdate, EmailSequenceResponse, EmailSequenceSchema (alias).
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class EmailSequenceBase(BaseModel):
    """Shared writable fields for EmailSequence."""
    operator_id: Optional[int] = None
    name: str
    trigger_status: Optional[str] = None
    steps_json: Optional[str] = None
    is_active: Optional[bool] = True


class EmailSequenceCreate(EmailSequenceBase):
    """Schema for creating a EmailSequence."""
    id: Optional[int] = None
    pass


class EmailSequenceUpdate(BaseModel):
    """Schema for updating a EmailSequence. All fields optional."""
    id: Optional[int] = None
    operator_id: Optional[int] = None
    name: Optional[str] = None
    trigger_status: Optional[str] = None
    steps_json: Optional[str] = None
    is_active: Optional[bool] = None


class EmailSequenceResponse(EmailSequenceBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


EmailSequenceSchema = EmailSequenceResponse
