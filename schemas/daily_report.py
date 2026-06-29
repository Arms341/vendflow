# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/daily_report.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for DailyReport entity.
Exports: DailyReportCreate, DailyReportUpdate, DailyReportResponse, DailyReportSchema (alias).
"""
from decimal import Decimal
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class DailyReportBase(BaseModel):
    """Shared writable fields for DailyReport."""
    machine_id: int
    report_date: Optional[date] = None
    total_transactions: Optional[int] = 0
    total_revenue: Optional[Decimal] = None
    card_revenue: Optional[Decimal] = None
    cash_revenue: Optional[Decimal] = None
    items_sold: Optional[int] = 0
    avg_transaction: Optional[Decimal] = None
    uptime_hours: Optional[Decimal] = None
    alerts_count: Optional[int] = 0


class DailyReportCreate(DailyReportBase):
    """Schema for creating a DailyReport."""
    id: Optional[int] = None
    pass


class DailyReportUpdate(BaseModel):
    """Schema for updating a DailyReport. All fields optional."""
    id: Optional[int] = None
    machine_id: Optional[int] = None
    report_date: Optional[date] = None
    total_transactions: Optional[int] = None
    total_revenue: Optional[Decimal] = None
    card_revenue: Optional[Decimal] = None
    cash_revenue: Optional[Decimal] = None
    items_sold: Optional[int] = None
    avg_transaction: Optional[Decimal] = None
    uptime_hours: Optional[Decimal] = None
    alerts_count: Optional[int] = None


class DailyReportResponse(DailyReportBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


DailyReportSchema = DailyReportResponse
