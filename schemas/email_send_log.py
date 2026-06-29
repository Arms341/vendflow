# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/email_send_log.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for EmailSendLog entity.
Exports: EmailSendLogCreate, EmailSendLogUpdate, EmailSendLogResponse, EmailSendLogSchema (alias).
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class EmailSendLogBase(BaseModel):
    """Shared writable fields for EmailSendLog."""
    lead_id: Optional[int] = None
    sequence_id: Optional[int] = None
    step_number: Optional[int] = 0
    subject: Optional[str] = None
    status: str
    sent_at: Optional[datetime] = None
    opened_at: Optional[datetime] = None
    clicked_at: Optional[datetime] = None


class EmailSendLogCreate(EmailSendLogBase):
    """Schema for creating a EmailSendLog."""
    id: Optional[int] = None
    pass


class EmailSendLogUpdate(BaseModel):
    """Schema for updating a EmailSendLog. All fields optional."""
    id: Optional[int] = None
    lead_id: Optional[int] = None
    sequence_id: Optional[int] = None
    step_number: Optional[int] = None
    subject: Optional[str] = None
    status: Optional[str] = None
    sent_at: Optional[datetime] = None
    opened_at: Optional[datetime] = None
    clicked_at: Optional[datetime] = None


class EmailSendLogResponse(EmailSendLogBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


EmailSendLogSchema = EmailSendLogResponse
