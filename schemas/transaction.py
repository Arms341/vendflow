# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/transaction.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for Transaction entity.
Exports: TransactionCreate, TransactionUpdate, TransactionResponse, TransactionSchema (alias).
"""
from decimal import Decimal
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TransactionBase(BaseModel):
    """Shared writable fields for Transaction."""
    machine_id: int
    product_id: Optional[int] = None
    amount: Decimal
    payment_method: Optional[str] = None
    payment_status: Optional[str] = None
    payment_ref: Optional[str] = None
    card_brand: Optional[str] = None
    card_last_four: Optional[str] = None
    terminal_id: Optional[str] = None
    slot_number: Optional[int] = None


class TransactionCreate(TransactionBase):
    """Schema for creating a Transaction."""
    id: Optional[int] = None
    pass


class TransactionUpdate(BaseModel):
    """Schema for updating a Transaction. All fields optional."""
    id: Optional[int] = None
    machine_id: Optional[int] = None
    product_id: Optional[int] = None
    amount: Optional[Decimal] = None
    payment_method: Optional[str] = None
    payment_status: Optional[str] = None
    payment_ref: Optional[str] = None
    card_brand: Optional[str] = None
    card_last_four: Optional[str] = None
    terminal_id: Optional[str] = None
    slot_number: Optional[int] = None


class TransactionResponse(TransactionBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


TransactionSchema = TransactionResponse
