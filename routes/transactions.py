"""
routes/transactions.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for Transaction entity.
All handlers sync def — FastAPI runs them in threadpool.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.transaction import Transaction
from schemas.transaction import TransactionCreate, TransactionResponse, TransactionUpdate

logger = logging.getLogger(__name__)

router = APIRouter(tags=["transactions"])


@router.get("/", response_model=List[TransactionResponse])
def list_transactions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all transactions with pagination."""
    result = db.execute(select(Transaction).offset(skip).limit(limit))
    rows = result.scalars().all()
    return [{k: v for k, v in r.__dict__.items() if not k.startswith("_")} for r in rows]


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """Get a transaction by ID."""
    row = db.get(Transaction, transaction_id)
    if not row:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.post("/", response_model=TransactionResponse, status_code=201)
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    """Create a new transaction."""
    try:
        row = Transaction(**data.model_dump())
        db.add(row)
        db.commit()
        db.refresh(row)
        return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Error creating transaction: %s", e)
        raise HTTPException(status_code=422, detail="Invalid data")


@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(transaction_id: int, data: TransactionUpdate, db: Session = Depends(get_db)):
    """Update an existing transaction."""
    row = db.get(Transaction, transaction_id)
    if not row:
        raise HTTPException(status_code=404, detail="Transaction not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        if hasattr(row, key) and value is not None:
            setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.delete("/{transaction_id}", status_code=200)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """Delete a transaction by ID."""
    row = db.get(Transaction, transaction_id)
    if not row:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(row)
    db.commit()
    return True
