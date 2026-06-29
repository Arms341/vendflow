# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/proposal.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for Proposal entity.
Exports: ProposalCreate, ProposalUpdate, ProposalResponse, ProposalSchema (alias).
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProposalBase(BaseModel):
    """Shared writable fields for Proposal."""
    lead_id: Optional[int] = None
    operator_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    machine_type: Optional[str] = None
    machine_count: Optional[int] = None
    monthly_revenue_estimate: Optional[float] = None
    commission_split: Optional[float] = None
    placement_fee: Optional[float] = None
    contract_term_months: Optional[int] = None
    status: str
    sent_at: Optional[datetime] = None
    viewed_at: Optional[datetime] = None
    signed_at: Optional[datetime] = None
    signature_data: Optional[str] = None
    pdf_url: Optional[str] = None


class ProposalCreate(ProposalBase):
    """Schema for creating a Proposal."""
    id: Optional[int] = None
    pass


class ProposalUpdate(BaseModel):
    """Schema for updating a Proposal. All fields optional."""
    id: Optional[int] = None
    lead_id: Optional[int] = None
    operator_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    machine_type: Optional[str] = None
    machine_count: Optional[int] = None
    monthly_revenue_estimate: Optional[float] = None
    commission_split: Optional[float] = None
    placement_fee: Optional[float] = None
    contract_term_months: Optional[int] = None
    status: Optional[str] = None
    sent_at: Optional[datetime] = None
    viewed_at: Optional[datetime] = None
    signed_at: Optional[datetime] = None
    signature_data: Optional[str] = None
    pdf_url: Optional[str] = None


class ProposalResponse(ProposalBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


ProposalSchema = ProposalResponse
