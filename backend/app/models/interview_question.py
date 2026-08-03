from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True)

    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"))
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))

    order_sequence = Column(Integer, nullable=False)

    interview = relationship(
    "Interview",
    back_populates="questions",
)
    question = relationship("Question")