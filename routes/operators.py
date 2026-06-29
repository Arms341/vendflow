"""
routes/operators.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for Operator entity.
All handlers sync def — FastAPI runs them in threadpool.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.operator import Operator
from schemas.operator import OperatorCreate, OperatorResponse, OperatorUpdate

logger = logging.getLogger(__name__)

router = APIRouter(tags=["operators"])


@router.get("/", response_model=List[OperatorResponse])
def list_operators(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all operators with pagination."""
    result = db.execute(select(Operator).offset(skip).limit(limit))
    rows = result.scalars().all()
    return [{k: v for k, v in r.__dict__.items() if not k.startswith("_")} for r in rows]


@router.get("/{operator_id}", response_model=OperatorResponse)
def get_operator(operator_id: int, db: Session = Depends(get_db)):
    """Get a operator by ID."""
    row = db.get(Operator, operator_id)
    if not row:
        raise HTTPException(status_code=404, detail="Operator not found")
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.post("/", response_model=OperatorResponse, status_code=201)
def create_operator(data: OperatorCreate, db: Session = Depends(get_db)):
    """Create a new operator."""
    try:
        row = Operator(**data.model_dump())
        db.add(row)
        db.commit()
        db.refresh(row)
        return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Error creating operator: %s", e)
        raise HTTPException(status_code=422, detail="Invalid data")


@router.put("/{operator_id}", response_model=OperatorResponse)
def update_operator(operator_id: int, data: OperatorUpdate, db: Session = Depends(get_db)):
    """Update an existing operator."""
    row = db.get(Operator, operator_id)
    if not row:
        raise HTTPException(status_code=404, detail="Operator not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        if hasattr(row, key) and value is not None:
            setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.delete("/{operator_id}", status_code=200)
def delete_operator(operator_id: int, db: Session = Depends(get_db)):
    """Delete a operator by ID."""
    row = db.get(Operator, operator_id)
    if not row:
        raise HTTPException(status_code=404, detail="Operator not found")
    db.delete(row)
    db.commit()
    return True
