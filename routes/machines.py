"""
routes/machines.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for Machine entity.
All handlers sync def — FastAPI runs them in threadpool.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.machine import Machine
from schemas.machine import MachineCreate, MachineUpdate, MachineResponse
from sqlalchemy import select

logger = logging.getLogger(__name__)

router = APIRouter(tags=["machines"])


@router.get("/", response_model=List[MachineResponse])
def list_machines(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all machines with pagination."""
    result = db.execute(select(Machine).offset(skip).limit(limit))
    return list(result.scalars().all())


@router.get("/{machine_id}", response_model=MachineResponse)
def get_machine(machine_id: int, db: Session = Depends(get_db)):
    """Get a machine by ID."""
    row = db.get(Machine, machine_id)
    if not row:
        raise HTTPException(status_code=404, detail="Machine not found")
    return row


@router.post("/", response_model=MachineResponse, status_code=201)
def create_machine(data: MachineCreate, db: Session = Depends(get_db)):
    """Create a new machine."""
    row = Machine(**data.model_dump(exclude_unset=True))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/{machine_id}", response_model=MachineResponse)
def update_machine(machine_id: int, data: MachineUpdate, db: Session = Depends(get_db)):
    """Update an existing machine."""
    row = db.get(Machine, machine_id)
    if not row:
        raise HTTPException(status_code=404, detail="Machine not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{machine_id}", status_code=200)
def delete_machine(machine_id: int, db: Session = Depends(get_db)):
    """Delete a machine by ID."""
    row = db.get(Machine, machine_id)
    if not row:
        raise HTTPException(status_code=404, detail="Machine not found")
    db.delete(row)
    db.commit()
    return True
