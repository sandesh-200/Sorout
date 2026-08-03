from sqlalchemy import Column, Integer, Enum, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from models.base import Base
import enum


class InterviewSessionStatus(str, enum.Enum):
    not_started = "not_started"
    ongoing = "ongoing"
    completed = "completed"
    evaluated = "evaluated"


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True)

    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"))
    candidate_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    current_interview_question_id = Column(Integer,ForeignKey("interview_questions.id"),nullable=True)

    status = Column(Enum(InterviewSessionStatus), default=InterviewSessionStatus.not_started,nullable=False)

    enrolled_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    completed_at = Column(TIMESTAMP(timezone=True), nullable=True)

    interview = relationship("Interview")
    candidate = relationship("User")
    current_interview_question = relationship("InterviewQuestion",foreign_keys=[current_interview_question_id])
    evaluation = relationship("InterviewEvaluation",uselist=False)
    messages = relationship(
    "ConversationMessage",
    back_populates="session",
    cascade="all, delete-orphan",
    order_by="ConversationMessage.created_at",
)