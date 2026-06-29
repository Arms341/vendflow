# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/operator_website.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for OperatorWebsite entity.
Exports: OperatorWebsiteCreate, OperatorWebsiteUpdate, OperatorWebsiteResponse, OperatorWebsiteSchema (alias).
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class OperatorWebsiteBase(BaseModel):
    """Shared writable fields for OperatorWebsite."""
    operator_id: Optional[int] = None
    domain: Optional[str] = None
    subdomain: Optional[str] = None
    company_name: str
    tagline: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    about_text: Optional[str] = None
    services_json: Optional[str] = None
    chatbot_enabled: Optional[bool] = False
    chatbot_greeting: Optional[str] = None
    is_published: Optional[bool] = False
    template_id: Optional[str] = None


class OperatorWebsiteCreate(OperatorWebsiteBase):
    """Schema for creating a OperatorWebsite."""
    id: Optional[int] = None
    pass


class OperatorWebsiteUpdate(BaseModel):
    """Schema for updating a OperatorWebsite. All fields optional."""
    id: Optional[int] = None
    operator_id: Optional[int] = None
    domain: Optional[str] = None
    subdomain: Optional[str] = None
    company_name: Optional[str] = None
    tagline: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    about_text: Optional[str] = None
    services_json: Optional[str] = None
    chatbot_enabled: Optional[bool] = None
    chatbot_greeting: Optional[str] = None
    is_published: Optional[bool] = None
    template_id: Optional[str] = None


class OperatorWebsiteResponse(OperatorWebsiteBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


OperatorWebsiteSchema = OperatorWebsiteResponse
