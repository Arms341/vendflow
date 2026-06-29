# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
from __future__ import annotations
from database import get_db
from fastapi import Depends
"""
services/product_service.py
Emitted by backend_emit (Tier-A) — CRUD service for Product entity.
"""
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.product import Product

logger = logging.getLogger(__name__)


class ProductService:
    """Service layer for Product CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> Product:
        row = Product(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[Product]:
        result = self.db.execute(select(Product).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, product_id: int) -> Optional[Product]:
        return self.db.get(Product, product_id)

    def update(self, product_id: int, data: dict) -> Optional[Product]:
        row = self.db.get(Product, product_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, product_id: int) -> bool:
        row = self.db.get(Product, product_id)
        if not row:
            return False
        self.db.delete(row)
        self.db.commit()
        return True



    list = list_all  # FIX-SERVICE-METHOD-ALIAS: route may call .list()
    get_all = list_all  # FIX-SERVICE-METHOD-ALIAS: route may call .get_all()
    get = get_by_id  # FIX-SERVICE-METHOD-ALIAS: route may call .get()

    # FIX-SERVICE-GET-LIST-ALIAS: route calls get_all() but method is list_all()
    get_all = list_all

    # FIX-SERVICE-GET-LIST-ALIAS: route calls get_all() but method is list_all()
    get_all = list_all
def get_product_service(db: Session = Depends(get_db)) -> ProductService:
    """DI factory for ProductService."""
    return ProductService(db=db)
