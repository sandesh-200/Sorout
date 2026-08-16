from sqlalchemy import Column, Integer, String, Enum,Boolean, TIMESTAMP, func, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base
import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    candidate = "candidate"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True,index=True)
    organization = relationship("Organization", back_populates="users")

    role = Column(Enum(UserRole), nullable=False, default=UserRole.candidate)
    is_onboarded = Column(Boolean,nullable=False,default=False)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )