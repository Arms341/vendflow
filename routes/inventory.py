# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1249 | cached=2026-06-25
"""
routes/inventory.py
Emitted by backend_emit (Tier-A) — CRUD routes for InventoryItem entity.
All handlers sync def — FastAPI runs them in a threadpool.
"""
from __future__ import annotations
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.inventory import InventoryItem
from schemas.inventory import InventoryItemCreate, InventoryItemUpdate, InventoryItemResponse
from sqlalchemy import select
logger= logging.getLogger(__name__)

logger = logging.getLogger(__name__)

router = APIRouter(tags=["inventory"])


@router.get("/", response_model=List[InventoryItemResponse])
def list_inventory(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all inventory with pagination."""
    result = db.execute(select(InventoryItem).offset(skip).limit(limit))
    return list(result.scalars().all())


@router.get("/{inventory_id}", response_model=InventoryItemResponse)
def get_inventory(inventory_id: int, db: Session = Depends(get_db)):
    """Get a inventory by ID."""
    row = db.get(InventoryItem, inventory_id)
    if not row:
        raise HTTPException(status_code=404, detail="InventoryItem not found")
    return row


@router.post("/", response_model=InventoryItemResponse, status_code=201)
def create_inventory(data: InventoryItemCreate, db: Session = Depends(get_db)):
    """Create a new inventory."""
    row = InventoryItem(**data.model_dump(exclude_unset=True))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/{inventory_id}", response_model=InventoryItemResponse)
def update_inventory(inventory_id: int, data: InventoryItemUpdate, db: Session = Depends(get_db)):
    """Update an existing inventory."""
    row = db.get(InventoryItem, inventory_id)
    if not row:
        raise HTTPException(status_code=404, detail="InventoryItem not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{inventory_id}", status_code=200)
def delete_inventory(inventory_id: int, db: Session = Depends(get_db)):
    """Delete a inventory by ID."""
    row = db.get(InventoryItem, inventory_id)
    if not row:
        raise HTTPException(status_code=404, detail="InventoryItem not found")
    db.delete(row)
    db.commit()
    return True

inventory_router = router  # FIX-ROUTER-ALIAS
