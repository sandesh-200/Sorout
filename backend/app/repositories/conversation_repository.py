from sqlalchemy.orm import Session

from models.conversation_message import (
    ConversationMessage,
    MessageRole,
)


class ConversationRepository:

    @staticmethod
    def create(
        db: Session,
        session_id: int,
        role: MessageRole,
        content: str,
    ) -> ConversationMessage:

        message = ConversationMessage(
            session_id=session_id,
            role=role,
            content=content,
        )

        db.add(message)
        db.flush()

        return message


    @staticmethod
    def get_first_message(
    db: Session,
    session_id: int,
) -> ConversationMessage | None:

        return (
        db.query(ConversationMessage)
        .filter(
            ConversationMessage.session_id == session_id,
        )
        .order_by(ConversationMessage.created_at.asc())
        .first()
    )


    @staticmethod
    def get_latest_ai_message(
    db: Session,
    session_id: int,
) -> ConversationMessage | None:

        return (
        db.query(ConversationMessage)
        .filter(
            ConversationMessage.session_id == session_id,
            ConversationMessage.role == MessageRole.ai,
        )
        .order_by(
            ConversationMessage.created_at.desc(),
        )
        .first()
    )

    @staticmethod
    def get_by_session(
        db: Session,
        session_id: int,
    ) -> list[ConversationMessage]:

        return (
            db.query(ConversationMessage)
            .filter(
                ConversationMessage.session_id == session_id,
            )
            .order_by(
                ConversationMessage.created_at.asc(),
            )
            .all()
        )