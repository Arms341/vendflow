# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/route.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for Route entity.
Exports: RouteCreate, RouteUpdate, RouteResponse, RouteSchema (alias).
"""
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class RouteBase(BaseModel):
    """Shared writable fields for Route."""
    operator_id: int
    driver_id: Optional[int] = None
    name: str
    status: Optional[str] = "planned"
    scheduled_date: Optional[date] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    machine_ids_json: Optional[str] = None
    optimized_order_json: Optional[str] = None
    total_distance_miles: Optional[float] = None
    notes: Optional[str] = None


class RouteCreate(RouteBase):
    """Schema for creating a Route."""
    id: Optional[int] = None
    pass


class RouteUpdate(BaseModel):
    """Schema for updating a Route. All fields optional."""
    id: Optional[int] = None
    operator_id: Optional[int] = None
    driver_id: Optional[int] = None
    name: Optional[str] = None
    status: Optional[str] = None
    scheduled_date: Optional[date] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    machine_ids_json: Optional[str] = None
    optimized_order_json: Optional[str] = None
    total_distance_miles: Optional[float] = None
    notes: Optional[str] = None


class RouteResponse(RouteBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


RouteSchema = RouteResponse
