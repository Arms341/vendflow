"""
routes/locations.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for Location entity.
All handlers sync def — FastAPI runs them in threadpool.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.location import Location
from schemas.location import LocationCreate, LocationResponse, LocationUpdate

logger = logging.getLogger(__name__)

router = APIRouter(tags=["locations"])


@router.get("/", response_model=List[LocationResponse])
def list_locations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all locations with pagination."""
    result = db.execute(select(Location).offset(skip).limit(limit))
    rows = result.scalars().all()
    return [{k: v for k, v in r.__dict__.items() if not k.startswith("_")} for r in rows]


@router.get("/{location_id}", response_model=LocationResponse)
def get_location(location_id: int, db: Session = Depends(get_db)):
    """Get a location by ID."""
    row = db.get(Location, location_id)
    if not row:
        raise HTTPException(status_code=404, detail="Location not found")
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.post("/", response_model=LocationResponse, status_code=201)
def create_location(data: LocationCreate, db: Session = Depends(get_db)):
    """Create a new location."""
    try:
        row = Location(**data.model_dump())
        db.add(row)
        db.commit()
        db.refresh(row)
        return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Error creating location: %s", e)
        raise HTTPException(status_code=422, detail="Invalid data")


@router.put("/{location_id}", response_model=LocationResponse)
def update_location(location_id: int, data: LocationUpdate, db: Session = Depends(get_db)):
    """Update an existing location."""
    row = db.get(Location, location_id)
    if not row:
        raise HTTPException(status_code=404, detail="Location not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        if hasattr(row, key) and value is not None:
            setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.delete("/{location_id}", status_code=200)
def delete_location(location_id: int, db: Session = Depends(get_db)):
    """Delete a location by ID."""
    row = db.get(Location, location_id)
    if not row:
        raise HTTPException(status_code=404, detail="Location not found")
    db.delete(row)
    db.commit()
    return True
