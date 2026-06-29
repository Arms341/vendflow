# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/machine.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for Machine entity.
Exports: MachineCreate, MachineUpdate, MachineResponse, MachineSchema (alias).
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class MachineBase(BaseModel):
    """Shared writable fields for Machine."""
    serial_number: str
    machine_type: Optional[str] = "ice"
    name: Optional[str] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    status: Optional[str] = "active"
    operator_id: Optional[int] = None
    location_id: Optional[int] = None
    terminal_id: Optional[str] = None
    pi_device_id: Optional[str] = None
    sim_iccid: Optional[str] = None
    firmware_version: Optional[str] = None
    temperature: Optional[float] = None
    is_online: Optional[bool] = False
    is_active: Optional[bool] = True
    last_service_at: Optional[datetime] = None
    last_restock_at: Optional[datetime] = None
    last_telemetry_at: Optional[datetime] = None
    installed_at: Optional[datetime] = None
    edge_mode: Optional[str] = "im30_only"
    connectivity_type: Optional[str] = "cellular"


class MachineCreate(MachineBase):
    """Schema for creating a Machine."""
    id: Optional[int] = None
    pass


class MachineUpdate(BaseModel):
    """Schema for updating a Machine. All fields optional."""
    id: Optional[int] = None
    serial_number: Optional[str] = None
    machine_type: Optional[str] = None
    name: Optional[str] = None
    manufacturer: Optional[str] = None
    model: Optional[str] = None
    status: Optional[str] = None
    operator_id: Optional[int] = None
    location_id: Optional[int] = None
    terminal_id: Optional[str] = None
    pi_device_id: Optional[str] = None
    sim_iccid: Optional[str] = None
    firmware_version: Optional[str] = None
    temperature: Optional[float] = None
    is_online: Optional[bool] = None
    is_active: Optional[bool] = None
    last_service_at: Optional[datetime] = None
    last_restock_at: Optional[datetime] = None
    last_telemetry_at: Optional[datetime] = None
    installed_at: Optional[datetime] = None
    edge_mode: Optional[str] = None
    connectivity_type: Optional[str] = None


class MachineResponse(MachineBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


MachineSchema = MachineResponse
