"""
routes/marketing_templates.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for MarketingTemplate entity. All handlers sync def.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.marketing_template import MarketingTemplate
from schemas.marketing_template import MarketingTemplateCreate, MarketingTemplateUpdate, MarketingTemplateResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["marketing_templates"])


@router.get("/", response_model=List[MarketingTemplateResponse])
def list_marketing_templates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all marketing_templates with pagination."""
    result = db.execute(select(MarketingTemplate).offset(skip).limit(limit))
    return list(result.scalars().all())


@router.get("/{marketing_template_id}", response_model=MarketingTemplateResponse)
def get_marketing_template(marketing_template_id: int, db: Session = Depends(get_db)):
    """Get a marketing_template by ID."""
    row = db.get(MarketingTemplate, marketing_template_id)
    if not row:
        raise HTTPException(status_code=404, detail="MarketingTemplate not found")
    return row


@router.post("/", response_model=MarketingTemplateResponse, status_code=201)
def create_marketing_template(data: MarketingTemplateCreate, db: Session = Depends(get_db)):
    """Create a new marketing_template."""
    row = MarketingTemplate(**data.model_dump(exclude_unset=True))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/{marketing_template_id}", response_model=MarketingTemplateResponse)
def update_marketing_template(marketing_template_id: int, data: MarketingTemplateUpdate, db: Session = Depends(get_db)):
    """Update an existing marketing_template."""
    row = db.get(MarketingTemplate, marketing_template_id)
    if not row:
        raise HTTPException(status_code=404, detail="MarketingTemplate not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{marketing_template_id}", status_code=200)
def delete_marketing_template(marketing_template_id: int, db: Session = Depends(get_db)):
    """Delete a marketing_template by ID."""
    row = db.get(MarketingTemplate, marketing_template_id)
    if not row:
        raise HTTPException(status_code=404, detail="MarketingTemplate not found")
    db.delete(row)
    db.commit()
    return True
