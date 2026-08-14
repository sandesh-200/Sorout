from sqlalchemy import (
    Column,
    Integer,
    Text,
    ForeignKey,
    TIMESTAMP,
    func,
    String
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from models.base import Base


class InterviewEvaluation(Base):
    __tablename__ = "interview_evaluations"

    id = Column(Integer, primary_key=True)

    session_id = Column(
        Integer,
        ForeignKey(
            "interview_sessions.id",
            ondelete="CASCADE",
        ),
        unique=True,
        nullable=False,
    )

    overall_score = Column(Integer, nullable=False)

    overall_feedback = Column(Text, nullable=False)
    

    strengths = Column(
        JSONB,
        nullable=False,
    )

    improvements = Column(
        JSONB,
        nullable=False,
    )

    evaluator_model = Column(
        Text,
        nullable=False,
    )

    # Stores per-question breakdowns from the LLM as JSON,
    # e.g. [{"question": "...", "answer": "...", "score": 8, "feedback": "..."}]
    question_evaluations = Column(
        JSONB,
        nullable=False,
        default=list,
    )

    evaluated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
    )

    session = relationship(
        "InterviewSession",
    )