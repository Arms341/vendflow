"""
routes/products.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD routes for Product entity.
All handlers sync def — FastAPI runs them in threadpool.
"""
import logging
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models.product import Product
from schemas.product import ProductCreate, ProductResponse, ProductUpdate

logger = logging.getLogger(__name__)

router = APIRouter(tags=["products"])


@router.get("/", response_model=List[ProductResponse])
def list_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List all products with pagination."""
    result = db.execute(select(Product).offset(skip).limit(limit))
    rows = result.scalars().all()
    return [{k: v for k, v in r.__dict__.items() if not k.startswith("_")} for r in rows]


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a product by ID."""
    row = db.get(Product, product_id)
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    """Create a new product."""
    try:
        row = Product(**data.model_dump())
        db.add(row)
        db.commit()
        db.refresh(row)
        return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Error creating product: %s", e)
        raise HTTPException(status_code=422, detail="Invalid data")


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    """Update an existing product."""
    row = db.get(Product, product_id)
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        if hasattr(row, key) and value is not None:
            setattr(row, key, value)
    db.commit()
    db.refresh(row)
    return {k: v for k, v in row.__dict__.items() if not k.startswith("_")}


@router.delete("/{product_id}", status_code=200)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product by ID."""
    row = db.get(Product, product_id)
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(row)
    db.commit()
    return True
