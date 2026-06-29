# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
routes/users.py
Emitted by backend_emit (Tier-A) — CRUD routes for User entity.
All handlers sync def — FastAPI runs them in a threadpool.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas.user import UserCreate, UserUpdate, UserResponse
from sqlalchemy import select

logger= logging.getLogger(__name__)

router = APIRouter(tags=["users"])


@router.get("/", response_model=List[UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all users with pagination."""
    result = db.execute(select(User).offset(skip).limit(limit))
    return list(result.scalars().all())


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get a user by ID."""
    row = db.get(User, user_id)
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    return row


@router.post("/", response_model=UserResponse, status_code=201)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user."""
    row = User(**data.model_dump(exclude_unset=True))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db)):
    """Update an existing user."""
    row = db.get(User, user_id)
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{user_id}", status_code=200)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user by ID."""
    row = db.get(User, user_id)
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(row)
    db.commit()
    return True

users_router = router  # FIX-ROUTER-ALIAS
