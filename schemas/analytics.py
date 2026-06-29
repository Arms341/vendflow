# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/analytics.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for Analytics entity.
Exports: AnalyticsCreate, AnalyticsUpdate, AnalyticsResponse, AnalyticsSchema (alias).
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AnalyticsBase(BaseModel):
    """Shared writable fields for Analytics."""
    title: str
    description: Optional[str] = None
    status: Optional[str] = "active"


class AnalyticsCreate(AnalyticsBase):
    """Schema for creating a Analytics."""
    id: Optional[int] = None
    pass


class AnalyticsUpdate(BaseModel):
    """Schema for updating a Analytics. All fields optional."""
    id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class AnalyticsResponse(AnalyticsBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


AnalyticsSchema = AnalyticsResponse
