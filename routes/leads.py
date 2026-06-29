"""
routes/leads.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for Lead entity. All handlers sync def.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.lead import Lead
from schemas.lead import LeadCreate, LeadUpdate, LeadResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["leads"])


@router.get("/", response_model=List[LeadResponse])
def list_leads(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all leads with pagination."""
    result = db.execute(select(Lead).offset(skip).limit(limit))
    return list(result.scalars().all())


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    """Get a lead by ID."""
    row = db.get(Lead, lead_id)
    if not row:
        raise HTTPException(status_code=404, detail="Lead not found")
    return row


@router.post("/", response_model=LeadResponse, status_code=201)
def create_lead(data: LeadCreate, db: Session = Depends(get_db)):
    """Create a new lead."""
    row = Lead(**data.model_dump(exclude_unset=True))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead(lead_id: int, data: LeadUpdate, db: Session = Depends(get_db)):
    """Update an existing lead."""
    row = db.get(Lead, lead_id)
    if not row:
        raise HTTPException(status_code=404, detail="Lead not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{lead_id}", status_code=200)
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    """Delete a lead by ID."""
    row = db.get(Lead, lead_id)
    if not row:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(row)
    db.commit()
    return True
