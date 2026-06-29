"""
routes/proposals.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for Proposal entity. All handlers sync def.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.proposal import Proposal
from schemas.proposal import ProposalCreate, ProposalUpdate, ProposalResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["proposals"])


@router.get("/", response_model=List[ProposalResponse])
def list_proposals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all proposals with pagination."""
    result = db.execute(select(Proposal).offset(skip).limit(limit))
    return list(result.scalars().all())


@router.get("/{proposal_id}", response_model=ProposalResponse)
def get_proposal(proposal_id: int, db: Session = Depends(get_db)):
    """Get a proposal by ID."""
    row = db.get(Proposal, proposal_id)
    if not row:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return row


@router.post("/", response_model=ProposalResponse, status_code=201)
def create_proposal(data: ProposalCreate, db: Session = Depends(get_db)):
    """Create a new proposal."""
    row = Proposal(**data.model_dump(exclude_unset=True))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/{proposal_id}", response_model=ProposalResponse)
def update_proposal(proposal_id: int, data: ProposalUpdate, db: Session = Depends(get_db)):
    """Update an existing proposal."""
    row = db.get(Proposal, proposal_id)
    if not row:
        raise HTTPException(status_code=404, detail="Proposal not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{proposal_id}", status_code=200)
def delete_proposal(proposal_id: int, db: Session = Depends(get_db)):
    """Delete a proposal by ID."""
    row = db.get(Proposal, proposal_id)
    if not row:
        raise HTTPException(status_code=404, detail="Proposal not found")
    db.delete(row)
    db.commit()
    return True
