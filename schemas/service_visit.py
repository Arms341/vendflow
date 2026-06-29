# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/service_visit.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for ServiceVisit entity.
Exports: ServiceVisitCreate, ServiceVisitUpdate, ServiceVisitResponse, ServiceVisitSchema (alias).
"""
from decimal import Decimal
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ServiceVisitBase(BaseModel):
    """Shared writable fields for ServiceVisit."""
    machine_id: int
    driver_id: int
    route_id: Optional[int] = None
    visit_type: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    notes: Optional[str] = None
    cash_collected: Optional[Decimal] = 0
    products_restocked_json: Optional[str] = None
    issues_found_json: Optional[str] = None


class ServiceVisitCreate(ServiceVisitBase):
    """Schema for creating a ServiceVisit."""
    id: Optional[int] = None
    pass


class ServiceVisitUpdate(BaseModel):
    """Schema for updating a ServiceVisit. All fields optional."""
    id: Optional[int] = None
    machine_id: Optional[int] = None
    driver_id: Optional[int] = None
    route_id: Optional[int] = None
    visit_type: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    notes: Optional[str] = None
    cash_collected: Optional[Decimal] = None
    products_restocked_json: Optional[str] = None
    issues_found_json: Optional[str] = None


class ServiceVisitResponse(ServiceVisitBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


ServiceVisitSchema = ServiceVisitResponse
