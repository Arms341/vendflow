# Golden cache | sig=GOLDEN-LOCK | source=build_vending_0625_1008 | cached=2026-06-25
"""
models/machine.py
Emitted by backend_emit (Tier-A) — ORM model for Machine (machines table).
"""
import logging
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String

from models.base import Base
logger = logging.getLogger(__name__)

logger = logging.getLogger(__name__)


class Machine(Base):
    """SQLAlchemy ORM model for the machines table."""

    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    serial_number = Column(String(100), unique=True, index=True, nullable=False, server_default='')
    machine_type = Column(String(50), server_default='ice', nullable=False)
    name = Column(String(255), nullable=True)
    manufacturer = Column(String(255), nullable=True)
    model = Column(String(255), nullable=True)
    status = Column(String(50), server_default='active', nullable=False)
    operator_id = Column(Integer, ForeignKey("operators.id"), nullable=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    terminal_id = Column(String(100), nullable=True)
    pi_device_id = Column(String(100), nullable=True)
    sim_iccid = Column(String(50), nullable=True)
    firmware_version = Column(String(50), nullable=True)
    temperature = Column(Float, nullable=True)
    is_online = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    last_service_at = Column(DateTime, nullable=True)
    last_restock_at = Column(DateTime, nullable=True)
    last_telemetry_at = Column(DateTime, nullable=True)
    installed_at = Column(DateTime, nullable=True)
    edge_mode = Column(String(20), server_default='im30_only', nullable=False)
    connectivity_type = Column(String(20), server_default='cellular', nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)

    def __repr__(self) -> str:
        return f"<Machine id={self.id}>"
