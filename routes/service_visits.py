"""
routes/service_visits.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for ServiceVisit entity.
All handlers sync def — FastAPI runs them in threadpool.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.service_visit import ServiceVisit
from schemas.service_visit import ServiceVisitCreate, ServiceVisitResponse, ServiceVisitUpdate

logger = logging.getLogger(__name__)

router = APIRouter(tags=["service_visits"])


@router.get("/", response_model=List[ServiceVisitResponse])
def list_service_visits(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all service_visits with pagination."""
    result = db.execute(select(ServiceVisit).offset(skip).limit(limit))
    rows = result.scalars().all()
    return [{k: v for k, v in r.__dict__.items() if not k.startswith("_")} for r in rows]


@router.get("/{service_visit_id}", response_model=ServiceVisitResponse)
def get_service_visit(service_visit_id: int, db: Session = Depends(get_db)):
    """Get a service_visit by ID."""
    row = db.get(ServiceVisit, service_visit_id)
    if not row:
        raise HTTPException(status_code=404, detail="ServiceVisit not found")
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.post("/", response_model=ServiceVisitResponse, status_code=201)
def create_service_visit(data: ServiceVisitCreate, db: Session = Depends(get_db)):
    """Create a new service_visit."""
    try:
        row = ServiceVisit(**data.model_dump())
        db.add(row)
        db.commit()
        db.refresh(row)
        return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Error creating service_visit: %s", e)
        raise HTTPException(status_code=422, detail="Invalid data")


@router.put("/{service_visit_id}", response_model=ServiceVisitResponse)
def update_service_visit(service_visit_id: int, data: ServiceVisitUpdate, db: Session = Depends(get_db)):
    """Update an existing service_visit."""
    row = db.get(ServiceVisit, service_visit_id)
    if not row:
        raise HTTPException(status_code=404, detail="ServiceVisit not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        if hasattr(row, key) and value is not None:
            setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.delete("/{service_visit_id}", status_code=200)
def delete_service_visit(service_visit_id: int, db: Session = Depends(get_db)):
    """Delete a service_visit by ID."""
    row = db.get(ServiceVisit, service_visit_id)
    if not row:
        raise HTTPException(status_code=404, detail="ServiceVisit not found")
    db.delete(row)
    db.commit()
    return True
