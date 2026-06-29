"""
routes/operator_websites.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for OperatorWebsite entity. All handlers sync def.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.operator_website import OperatorWebsite
from schemas.operator_website import OperatorWebsiteCreate, OperatorWebsiteUpdate, OperatorWebsiteResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["operator_websites"])


@router.get("/", response_model=List[OperatorWebsiteResponse])
def list_operator_websites(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all operator_websites with pagination."""
    result = db.execute(select(OperatorWebsite).offset(skip).limit(limit))
    return list(result.scalars().all())


@router.get("/{operator_website_id}", response_model=OperatorWebsiteResponse)
def get_operator_website(operator_website_id: int, db: Session = Depends(get_db)):
    """Get a operator_website by ID."""
    row = db.get(OperatorWebsite, operator_website_id)
    if not row:
        raise HTTPException(status_code=404, detail="OperatorWebsite not found")
    return row


@router.post("/", response_model=OperatorWebsiteResponse, status_code=201)
def create_operator_website(data: OperatorWebsiteCreate, db: Session = Depends(get_db)):
    """Create a new operator_website."""
    row = OperatorWebsite(**data.model_dump(exclude_unset=True))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/{operator_website_id}", response_model=OperatorWebsiteResponse)
def update_operator_website(operator_website_id: int, data: OperatorWebsiteUpdate, db: Session = Depends(get_db)):
    """Update an existing operator_website."""
    row = db.get(OperatorWebsite, operator_website_id)
    if not row:
        raise HTTPException(status_code=404, detail="OperatorWebsite not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{operator_website_id}", status_code=200)
def delete_operator_website(operator_website_id: int, db: Session = Depends(get_db)):
    """Delete a operator_website by ID."""
    row = db.get(OperatorWebsite, operator_website_id)
    if not row:
        raise HTTPException(status_code=404, detail="OperatorWebsite not found")
    db.delete(row)
    db.commit()
    return True
