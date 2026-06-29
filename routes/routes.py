"""
routes/routes.py  v1.0.1
Locked template — JARVIS vending_machine gig.
CRUD routes for Route entity (service delivery routes).
All handlers sync def — FastAPI runs them in threadpool.

v1.0.1: import + use the real model class `Route` (models/route.py exports
  `Route`, plan provides=['Route']). v1.0.0 imported `RouteModel`, which the
  AI-generated model never defines -> `cannot import name 'RouteModel'` ->
  router registration crash. Only survived before via a fixer coin-flip
  (FIX-PHANTOM-SYMBOL-IMPORT vs LOCKED-TEMPLATE-RESTORE last-writer).
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.route import Route
from schemas.route import RouteCreate, RouteResponse, RouteUpdate

logger = logging.getLogger(__name__)

router = APIRouter(tags=["routes"])


@router.get("/", response_model=List[RouteResponse])
def list_routes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all routes with pagination."""
    result = db.execute(select(Route).offset(skip).limit(limit))
    rows = result.scalars().all()
    return [{k: v for k, v in r.__dict__.items() if not k.startswith("_")} for r in rows]


@router.get("/{route_id}", response_model=RouteResponse)
def get_route(route_id: int, db: Session = Depends(get_db)):
    """Get a route by ID."""
    row = db.get(Route, route_id)
    if not row:
        raise HTTPException(status_code=404, detail="Route not found")
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.post("/", response_model=RouteResponse, status_code=201)
def create_route(data: RouteCreate, db: Session = Depends(get_db)):
    """Create a new route."""
    try:
        row = Route(**data.model_dump())
        db.add(row)
        db.commit()
        db.refresh(row)
        return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Error creating route: %s", e)
        raise HTTPException(status_code=422, detail="Invalid data")


@router.put("/{route_id}", response_model=RouteResponse)
def update_route(route_id: int, data: RouteUpdate, db: Session = Depends(get_db)):
    """Update an existing route."""
    row = db.get(Route, route_id)
    if not row:
        raise HTTPException(status_code=404, detail="Route not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        if hasattr(row, key) and value is not None:
            setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.delete("/{route_id}", status_code=200)
def delete_route(route_id: int, db: Session = Depends(get_db)):
    """Delete a route by ID."""
    row = db.get(Route, route_id)
    if not row:
        raise HTTPException(status_code=404, detail="Route not found")
    db.delete(row)
    db.commit()
    return True
