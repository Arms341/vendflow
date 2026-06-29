# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/alert.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for Alert entity.
Exports: AlertCreate, AlertUpdate, AlertResponse, AlertSchema (alias).
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AlertBase(BaseModel):
    """Shared writable fields for Alert."""
    machine_id: Optional[int] = None
    alert_type: str
    severity: Optional[str] = "medium"
    message: str
    is_acknowledged: Optional[bool] = False
    acknowledged_by: Optional[int] = None
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    data_json: Optional[str] = None


class AlertCreate(AlertBase):
    """Schema for creating a Alert."""
    id: Optional[int] = None
    pass


class AlertUpdate(BaseModel):
    """Schema for updating a Alert. All fields optional."""
    id: Optional[int] = None
    machine_id: Optional[int] = None
    alert_type: Optional[str] = None
    severity: Optional[str] = None
    message: Optional[str] = None
    is_acknowledged: Optional[bool] = None
    acknowledged_by: Optional[int] = None
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    data_json: Optional[str] = None


class AlertResponse(AlertBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


AlertSchema = AlertResponse
