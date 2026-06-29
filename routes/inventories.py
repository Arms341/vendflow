"""
routes/inventory.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for Inventory entity.
All handlers sync def — FastAPI runs them in threadpool.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.inventory import InventoryItem
from schemas.inventory import InventoryItemCreate, InventoryItemResponse, InventoryItemUpdate

logger = logging.getLogger(__name__)

router = APIRouter(tags=["inventory"])


@router.get("/", response_model=List[InventoryItemResponse])
def list_inventory_items(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all inventory_items with pagination."""
    result = db.execute(select(InventoryItem).offset(skip).limit(limit))
    rows = result.scalars().all()
    return [{k: v for k, v in r.__dict__.items() if not k.startswith("_")} for r in rows]


@router.get("/{inventory_id}", response_model=InventoryItemResponse)
def get_inventory_item(inventory_id: int, db: Session = Depends(get_db)):
    """Get a inventory_item by ID."""
    row = db.get(InventoryItem, inventory_id)
    if not row:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.post("/", response_model=InventoryItemResponse, status_code=201)
def create_inventory_item(data: InventoryItemCreate, db: Session = Depends(get_db)):
    """Create a new inventory_item."""
    try:
        row = InventoryItem(**data.model_dump())
        db.add(row)
        db.commit()
        db.refresh(row)
        return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Error creating inventory_item: %s", e)
        raise HTTPException(status_code=422, detail="Invalid data")


@router.put("/{inventory_id}", response_model=InventoryItemResponse)
def update_inventory_item(inventory_id: int, data: InventoryItemUpdate, db: Session = Depends(get_db)):
    """Update an existing inventory_item."""
    row = db.get(InventoryItem, inventory_id)
    if not row:
        raise HTTPException(status_code=404, detail="Inventory not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        if hasattr(row, key) and value is not None:
            setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.delete("/{inventory_id}", status_code=200)
def delete_inventory_item(inventory_id: int, db: Session = Depends(get_db)):
    """Delete a inventory_item by ID."""
    row = db.get(InventoryItem, inventory_id)
    if not row:
        raise HTTPException(status_code=404, detail="Inventory not found")
    db.delete(row)
    db.commit()
    return True
