"""
routes/daily_reports.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for DailyReport entity. All handlers sync def.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.daily_report import DailyReport
from schemas.daily_report import DailyReportCreate, DailyReportUpdate, DailyReportResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["daily_reports"])


@router.get("/", response_model=List[DailyReportResponse])
def list_daily_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all daily_reports with pagination."""
    result = db.execute(select(DailyReport).offset(skip).limit(limit))
    return list(result.scalars().all())


@router.get("/{daily_report_id}", response_model=DailyReportResponse)
def get_daily_report(daily_report_id: int, db: Session = Depends(get_db)):
    """Get a daily_report by ID."""
    row = db.get(DailyReport, daily_report_id)
    if not row:
        raise HTTPException(status_code=404, detail="DailyReport not found")
    return row


@router.post("/", response_model=DailyReportResponse, status_code=201)
def create_daily_report(data: DailyReportCreate, db: Session = Depends(get_db)):
    """Create a new daily_report."""
    row = DailyReport(**data.model_dump(exclude_unset=True))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/{daily_report_id}", response_model=DailyReportResponse)
def update_daily_report(daily_report_id: int, data: DailyReportUpdate, db: Session = Depends(get_db)):
    """Update an existing daily_report."""
    row = db.get(DailyReport, daily_report_id)
    if not row:
        raise HTTPException(status_code=404, detail="DailyReport not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{daily_report_id}", status_code=200)
def delete_daily_report(daily_report_id: int, db: Session = Depends(get_db)):
    """Delete a daily_report by ID."""
    row = db.get(DailyReport, daily_report_id)
    if not row:
        raise HTTPException(status_code=404, detail="DailyReport not found")
    db.delete(row)
    db.commit()
    return True
