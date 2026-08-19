import enum
from sqlalchemy import (
    Column, Integer, Enum, TIMESTAMP, ForeignKey,
    UniqueConstraint, func
)
from sqlalchemy.orm import relationship
from models.base import Base


class MembershipRole(str, enum.Enum):
    admin = "admin"
    candidate = "candidate"


class OrganizationMembership(Base):
    __tablename__ = "organization_memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(Enum(MembershipRole), nullable=False)
    joined_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "organization_id", name="uq_user_org_membership"),
    )

    # Relationships
    user = relationship("User", back_populates="memberships")
    organization = relationship("Organization", back_populates="memberships")