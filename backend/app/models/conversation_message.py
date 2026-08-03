import enum

from sqlalchemy import (
    Column,
    Enum,
    ForeignKey,
    Integer,
    Text,
    TIMESTAMP,
    func,
)

from sqlalchemy.orm import relationship

from models.base import Base


class MessageRole(str, enum.Enum):
    ai = "ai"
    candidate = "candidate"


class ConversationMessage(Base):
    __tablename__ = "conversation_messages"

    id = Column(Integer, primary_key=True)

    session_id = Column(
        Integer,
        ForeignKey(
            "interview_sessions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    role = Column(
        Enum(MessageRole),
        nullable=False,
    )

    content = Column(
        Text,
        nullable=False,
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
    )

    session = relationship(
        "InterviewSession",
        back_populates="messages",
    )