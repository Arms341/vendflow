"""
schemas/user.py - Universal locked template v1.0.0
JARVIS Locked File Library - gig-agnostic (no gig_type).

Pydantic v2 schemas for the universal User entity (models/user.py universal:
id, email, hashed_password, full_name, is_active, created_at, updated_at).

This is the gig-agnostic fallback so that any non-food-truck gig importing
`schemas.user` resolves to a real schema instead of an empty auto-generated
stub (the stub had no `password` field, which silently breaks any user_service
that does UserCreate(**data).password). Gigs that extend the user with extra
fields (e.g. food_truck_pos adds phone/role/avatar_url) ship their own Tier-2
schemas/user.py, which the loader prefers on a gig match.

UserResponse never exposes hashed_password.
"""
import logging
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

logger = logging.getLogger(__name__)


class UserBase(BaseModel):
    """Shared, optional-by-default fields for the User entity."""
    email: Optional[str] = None
    full_name: Optional[str] = None
    is_active: bool = True
    model_config = ConfigDict(from_attributes=True)


class UserCreate(UserBase):
    """Input schema for creating a User. email + password are required."""
    email: str
    password: str
    full_name: Optional[str] = None


class UserUpdate(BaseModel):
    """Schema for partial updates. All fields optional."""
    email: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class UserResponse(UserBase):
    """Output schema for API responses. Never exposes hashed_password."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# Alias some code paths import.
UserSchema = UserResponse
