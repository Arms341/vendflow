"""
routes/alerts.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for Alert entity.
All handlers sync def — FastAPI runs them in threadpool.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.alert import Alert
from schemas.alert import AlertCreate, AlertResponse, AlertUpdate

logger = logging.getLogger(__name__)

router = APIRouter(tags=["alerts"])


@router.get("/", response_model=List[AlertResponse])
def list_alerts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all alerts with pagination."""
    result = db.execute(select(Alert).offset(skip).limit(limit))
    rows = result.scalars().all()
    return [{k: v for k, v in r.__dict__.items() if not k.startswith("_")} for r in rows]


@router.get("/{alert_id}", response_model=AlertResponse)
def get_alert(alert_id: int, db: Session = Depends(get_db)):
    """Get a alert by ID."""
    row = db.get(Alert, alert_id)
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.post("/", response_model=AlertResponse, status_code=201)
def create_alert(data: AlertCreate, db: Session = Depends(get_db)):
    """Create a new alert."""
    try:
        row = Alert(**data.model_dump())
        db.add(row)
        db.commit()
        db.refresh(row)
        return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Error creating alert: %s", e)
        raise HTTPException(status_code=422, detail="Invalid data")


@router.put("/{alert_id}", response_model=AlertResponse)
def update_alert(alert_id: int, data: AlertUpdate, db: Session = Depends(get_db)):
    """Update an existing alert."""
    row = db.get(Alert, alert_id)
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        if hasattr(row, key) and value is not None:
            setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.delete("/{alert_id}", status_code=200)
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    """Delete a alert by ID."""
    row = db.get(Alert, alert_id)
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.delete(row)
    db.commit()
    return True
