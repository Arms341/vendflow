"""
routes/analytics.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for Analytics entity. All handlers sync def, db injected via
Depends(get_db), model accessed directly (mirrors locked leads/alerts routes).
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.analytics import Analytics
from schemas.analytics import AnalyticsCreate, AnalyticsUpdate, AnalyticsResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["analytics"])


@router.get("/", response_model=List[AnalyticsResponse])
def list_analytics(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all analytics records with pagination."""
    result = db.execute(select(Analytics).offset(skip).limit(limit))
    return list(result.scalars().all())


@router.get("/{analytics_id}", response_model=AnalyticsResponse)
def get_analytics(analytics_id: int, db: Session = Depends(get_db)):
    """Get an analytics record by ID."""
    row = db.get(Analytics, analytics_id)
    if not row:
        raise HTTPException(status_code=404, detail="Analytics record not found")
    return row


@router.post("/", response_model=AnalyticsResponse, status_code=201)
def create_analytics(data: AnalyticsCreate, db: Session = Depends(get_db)):
    """Create a new analytics record."""
    row = Analytics(**data.model_dump(exclude_unset=True))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/{analytics_id}", response_model=AnalyticsResponse)
def update_analytics(analytics_id: int, data: AnalyticsUpdate, db: Session = Depends(get_db)):
    """Update an existing analytics record."""
    row = db.get(Analytics, analytics_id)
    if not row:
        raise HTTPException(status_code=404, detail="Analytics record not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{analytics_id}", status_code=200)
def delete_analytics(analytics_id: int, db: Session = Depends(get_db)):
    """Delete an analytics record by ID."""
    row = db.get(Analytics, analytics_id)
    if not row:
        raise HTTPException(status_code=404, detail="Analytics record not found")
    db.delete(row)
    db.commit()
    return True
