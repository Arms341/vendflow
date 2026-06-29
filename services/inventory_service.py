"""
services/inventory_service.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD service for InventoryItem entity.
"""
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.inventory import InventoryItem

logger = logging.getLogger(__name__)


class InventoryService:
    """Service layer for InventoryItem CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> InventoryItem:
        row = InventoryItem(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[InventoryItem]:
        result = self.db.execute(select(InventoryItem).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, inventory_id: int) -> Optional[InventoryItem]:
        return self.db.get(InventoryItem, inventory_id)

    def update(self, inventory_id: int, data: dict) -> Optional[InventoryItem]:
        row = self.db.get(InventoryItem, inventory_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, inventory_id: int) -> bool:
        row = self.db.get(InventoryItem, inventory_id)
        if not row:
            return False
        self.db.delete(row)
        self.db.commit()
        return True


def get_inventory_service(db: Session) -> InventoryService:
    """DI factory for InventoryService."""
    return InventoryService(db=db)
