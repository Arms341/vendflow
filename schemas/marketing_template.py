# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
schemas/marketing_template.py
Emitted by backend_emit (Tier-A) — Pydantic schemas for MarketingTemplate entity.
Exports: MarketingTemplateCreate, MarketingTemplateUpdate, MarketingTemplateResponse, MarketingTemplateSchema (alias).
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class MarketingTemplateBase(BaseModel):
    """Shared writable fields for MarketingTemplate."""
    name: str
    category: str
    template_type: Optional[str] = None
    content_html: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_active: Optional[bool] = True


class MarketingTemplateCreate(MarketingTemplateBase):
    """Schema for creating a MarketingTemplate."""
    id: Optional[int] = None
    pass


class MarketingTemplateUpdate(BaseModel):
    """Schema for updating a MarketingTemplate. All fields optional."""
    id: Optional[int] = None
    name: Optional[str] = None
    category: Optional[str] = None
    template_type: Optional[str] = None
    content_html: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_active: Optional[bool] = None


class MarketingTemplateResponse(MarketingTemplateBase):
    """Response schema with DB-managed fields."""
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


MarketingTemplateSchema = MarketingTemplateResponse
