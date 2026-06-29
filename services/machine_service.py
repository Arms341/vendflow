"""
services/machine_service.py  v1.0.0
Locked template — JARVIS vending_machine gig.
CRUD service for Machine entity.
"""
import logging
from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from models.machine import Machine

logger = logging.getLogger(__name__)


class MachineService:
    """Service layer for Machine CRUD operations."""

    def __init__(self, db: Session = None):
        self.db = db

    def create(self, data: dict) -> Machine:
        row = Machine(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_all(self, skip: int = 0, limit: int = 100) -> List[Machine]:
        result = self.db.execute(select(Machine).offset(skip).limit(limit))
        return list(result.scalars().all())

    def get_by_id(self, machine_id: int) -> Optional[Machine]:
        return self.db.get(Machine, machine_id)

    def update(self, machine_id: int, data: dict) -> Optional[Machine]:
        row = self.db.get(Machine, machine_id)
        if not row:
            return None
        for key, value in data.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)
        self.db.commit()
        self.db.refresh(row)
        return row

    def delete(self, machine_id: int) -> bool:
        row = self.db.get(Machine, machine_id)
        if not row:
            return False
        self.db.delete(row)
        self.db.commit()
        return True


def get_machine_service(db: Session) -> MachineService:
    """DI factory for MachineService."""
    return MachineService(db=db)
