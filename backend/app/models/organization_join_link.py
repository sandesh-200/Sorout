import hashlib
import secrets

from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    func,
    TIMESTAMP
)
from sqlalchemy.orm import relationship

from models.base import Base

class OrganizationJoinLink(Base):
    __tablename__ = "organization_join_links"

    id = Column(Integer, primary_key=True, index=True)

    organization_id = Column(
        Integer,
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    token_hash = Column(
        String(64),
        unique=True,
        nullable=False,
        index=True,
    )

    created_by_user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    expires_at = Column(
        TIMESTAMP(timezone=True),
        nullable=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    organization = relationship(
        "Organization",
        back_populates="join_links",
    )

    created_by = relationship(
        "User",
        foreign_keys=[created_by_user_id],
    )


def generate_join_token() -> str:
    return secrets.token_urlsafe(32)


def hash_join_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()