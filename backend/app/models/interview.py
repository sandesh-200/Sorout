from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from models.base import Base
import enum


class InterviewStatus(str, enum.Enum):
    draft = "draft"
    ready = "ready"
    ongoing = "ongoing"
    completed = "completed"
    cancelled = "cancelled"


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    job_position = Column(String(100), nullable=False)
    seniority_level = Column(String(50), nullable=False)
    max_questions = Column(Integer, default=5, nullable=False)

    status = Column(Enum(InterviewStatus), default=InterviewStatus.draft)

    created_by = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)

    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    # relationships
    creator = relationship("User")

    questions = relationship(
        "InterviewQuestion",
        back_populates="interview",
        cascade="all, delete-orphan",
        order_by="InterviewQuestion.order_sequence",
    )
