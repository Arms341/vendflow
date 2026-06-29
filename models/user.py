"""
models/user.py - Universal locked template v1.0.0
JARVIS Locked File Library — DO NOT MODIFY WITHOUT UPDATING VERSION

Universal User model for authentication. Any gig type can override
this with a gig-specific Tier 2 template (e.g. food_truck_pos adds
phone, avatar_url, role fields).

v1.0.0: Extracted from models/base.py v1.0.2. Identical schema.
"""
import logging
from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, Column, DateTime, Integer, String, select
from sqlalchemy.orm import Session

from models.base import Base, get_password_hash, verify_password

logger = logging.getLogger(__name__)


class User(Base):
    """
    User ORM model. Stores authentication credentials and profile data.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r} active={self.is_active}>"

    @classmethod
    def get_by_email(cls, db: Session, email: str) -> Optional["User"]:
        """Return User with given email or None."""
        try:
            result = db.execute(select(cls).where(cls.email == email))
            return result.scalar_one_or_none()
        except Exception as exc:
            logger.error(f"[USER] get_by_email failed: {exc}")
            return None

    @classmethod
    def get_by_id(cls, db: Session, user_id: int) -> Optional["User"]:
        """Return User with given id or None."""
        try:
            result = db.execute(select(cls).where(cls.id == user_id))
            return result.scalar_one_or_none()
        except Exception as exc:
            logger.error(f"[USER] get_by_id failed: {exc}")
            return None

    @classmethod
    def create(cls, db: Session, email: str, password: str, is_active: bool = True) -> "User":
        """
        Create and persist a new User with a hashed password.
        Raises ValueError if email already exists.
        """
        existing = cls.get_by_email(db, email)
        if existing:
            raise ValueError(f"User with email '{email}' already exists")
        user = cls(
            email=email.lower().strip(),
            hashed_password=get_password_hash(password),
            is_active=is_active,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"[USER] Created user id={user.id} email={user.email!r}")
        return user

    def check_password(self, plain_password: str) -> bool:
        """Verify a password against this user's stored hash."""
        return verify_password(plain_password, self.hashed_password)
