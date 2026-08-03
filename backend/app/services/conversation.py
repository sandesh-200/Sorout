from fastapi import HTTPException
from sqlalchemy.orm import Session

from ai.chains.conversation_starter import (
    ConversationStarter,
)
from ai.chains.conversation_chat import ConversationChat
from models.conversation_message import MessageRole
from models.interview_session import InterviewSessionStatus
from repositories.conversation_repository import (
    ConversationRepository,
)
from repositories.interview_session_repository import (
    InterviewSessionRepository,
)

from services.evaluation import EvaluationService


class ConversationService:

    @staticmethod
    def start(
        db: Session,
        session_id: int,
        candidate_id: int,
    ):

        session = InterviewSessionRepository.get_by_id(
            db,
            session_id,
        )

        if not session:
            raise HTTPException(
                status_code=404,
                detail="Interview session not found.",
            )

        if session.candidate_id != candidate_id:
            raise HTTPException(
                status_code=403,
                detail="Forbidden.",
            )

        if session.status == InterviewSessionStatus.completed:
            raise HTTPException(
                status_code=400,
                detail="Interview already completed.",
            )

        if session.status == InterviewSessionStatus.evaluated:
            raise HTTPException(
                status_code=400,
                detail="Interview has already been evaluated"
            )

        if session.status == InterviewSessionStatus.not_started:
            session.status = InterviewSessionStatus.ongoing

        existing_ai_message = (
            ConversationRepository.get_latest_ai_message(
                db=db,
                session_id=session.id
            )
        )

        if existing_ai_message:
            return existing_ai_message

        opening_message = ConversationStarter.generate(
            session.interview,
        )

        message = ConversationRepository.create(
            db=db,
            session_id=session.id,
            role=MessageRole.ai,
            content=opening_message,
        )

        db.commit()
        db.refresh(message)

        return message


    @staticmethod
    def chat(
    db: Session,
    session_id: int,
    candidate_id: int,
    message: str,
):
        session = InterviewSessionRepository.get_by_id(
        db=db,
        session_id=session_id,
    )

        if not session:
            raise HTTPException(
            status_code=404,
            detail="Interview session not found.",
        )

        if session.candidate_id != candidate_id:
            raise HTTPException(
            status_code=403,
            detail="Unauthorized.",
        )

        if session.status != InterviewSessionStatus.ongoing:
            raise HTTPException(
            status_code=400,
            detail="Interview is not active.",
        )

    # Save candidate message
        ConversationRepository.create(
        db=db,
        session_id=session.id,
        role=MessageRole.candidate,
        content=message,
    )

        db.commit()

        messages = ConversationRepository.get_by_session(
        db=db,
        session_id=session.id,
    )

        ai_result = ConversationChat.generate(
        interview=session.interview,
        messages=messages,
    )

    # Save AI reply
        ai_message = ConversationRepository.create(
    db=db,
    session_id=session.id,
    role=MessageRole.ai,
    content=ai_result.reply,
)

        if ai_result.completed:
            session.status = InterviewSessionStatus.completed

            InterviewSessionRepository.update(
            db=db,
            session=session,
        )

        db.commit()
        db.refresh(ai_message)

        return {
    "message": ai_message,
    "completed": ai_result.completed,
}