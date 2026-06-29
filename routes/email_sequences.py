"""
routes/email_sequences.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for EmailSequence entity. All handlers sync def.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.email_sequence import EmailSequence
from schemas.email_sequence import EmailSequenceCreate, EmailSequenceUpdate, EmailSequenceResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["email_sequences"])


@router.get("/", response_model=List[EmailSequenceResponse])
def list_email_sequences(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all email_sequences with pagination."""
    result = db.execute(select(EmailSequence).offset(skip).limit(limit))
    return list(result.scalars().all())


@router.get("/{email_sequence_id}", response_model=EmailSequenceResponse)
def get_email_sequence(email_sequence_id: int, db: Session = Depends(get_db)):
    """Get a email_sequence by ID."""
    row = db.get(EmailSequence, email_sequence_id)
    if not row:
        raise HTTPException(status_code=404, detail="EmailSequence not found")
    return row


@router.post("/", response_model=EmailSequenceResponse, status_code=201)
def create_email_sequence(data: EmailSequenceCreate, db: Session = Depends(get_db)):
    """Create a new email_sequence."""
    row = EmailSequence(**data.model_dump(exclude_unset=True))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/{email_sequence_id}", response_model=EmailSequenceResponse)
def update_email_sequence(email_sequence_id: int, data: EmailSequenceUpdate, db: Session = Depends(get_db)):
    """Update an existing email_sequence."""
    row = db.get(EmailSequence, email_sequence_id)
    if not row:
        raise HTTPException(status_code=404, detail="EmailSequence not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{email_sequence_id}", status_code=200)
def delete_email_sequence(email_sequence_id: int, db: Session = Depends(get_db)):
    """Delete a email_sequence by ID."""
    row = db.get(EmailSequence, email_sequence_id)
    if not row:
        raise HTTPException(status_code=404, detail="EmailSequence not found")
    db.delete(row)
    db.commit()
    return True
