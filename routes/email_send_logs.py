"""
routes/email_send_logs.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for EmailSendLog entity. All handlers sync def.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.email_send_log import EmailSendLog
from schemas.email_send_log import EmailSendLogCreate, EmailSendLogUpdate, EmailSendLogResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["email_send_logs"])


@router.get("/", response_model=List[EmailSendLogResponse])
def list_email_send_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all email_send_logs with pagination."""
    result = db.execute(select(EmailSendLog).offset(skip).limit(limit))
    return list(result.scalars().all())


@router.get("/{email_send_log_id}", response_model=EmailSendLogResponse)
def get_email_send_log(email_send_log_id: int, db: Session = Depends(get_db)):
    """Get a email_send_log by ID."""
    row = db.get(EmailSendLog, email_send_log_id)
    if not row:
        raise HTTPException(status_code=404, detail="EmailSendLog not found")
    return row


@router.post("/", response_model=EmailSendLogResponse, status_code=201)
def create_email_send_log(data: EmailSendLogCreate, db: Session = Depends(get_db)):
    """Create a new email_send_log."""
    row = EmailSendLog(**data.model_dump(exclude_unset=True))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/{email_send_log_id}", response_model=EmailSendLogResponse)
def update_email_send_log(email_send_log_id: int, data: EmailSendLogUpdate, db: Session = Depends(get_db)):
    """Update an existing email_send_log."""
    row = db.get(EmailSendLog, email_send_log_id)
    if not row:
        raise HTTPException(status_code=404, detail="EmailSendLog not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{email_send_log_id}", status_code=200)
def delete_email_send_log(email_send_log_id: int, db: Session = Depends(get_db)):
    """Delete a email_send_log by ID."""
    row = db.get(EmailSendLog, email_send_log_id)
    if not row:
        raise HTTPException(status_code=404, detail="EmailSendLog not found")
    db.delete(row)
    db.commit()
    return True
