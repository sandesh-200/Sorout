from sqlalchemy import Column, Integer, String, TIMESTAMP, func
from sqlalchemy.orm import relationship
from models.base import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True), 
        server_default=func.now(), 
        nullable=False
    )

    # Relationships
    users = relationship("User", back_populates="organization")
