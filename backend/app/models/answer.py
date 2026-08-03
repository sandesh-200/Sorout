from sqlalchemy import Column, Integer, Text, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from models.base import Base


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True)

    session_id = Column(Integer, ForeignKey("interview_sessions.id", ondelete="CASCADE"))
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))

    answer_text = Column(Text, nullable=False)

    submitted_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    evaluation = relationship("QuestionEvaluation",uselist=False,back_populates="answer")

    session = relationship("InterviewSession")
    question = relationship("Question",uselist=False)