from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from models.user import User
from schemas.conversation import (
    ConversationStartResponse,
    ConversationMessageRequest,
    ConversationMessageResponse
)
from services.conversation import ConversationService
from services.user import candidate_required

router = APIRouter(
    prefix="/conversations",
    tags=["Candidate-Conversations"],
)


@router.post(
    "/{session_id}/start",
    response_model=ConversationStartResponse,
)
def start_conversation(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(candidate_required),
):
    return ConversationService.start(
        db=db,
        session_id=session_id,
        candidate_id=current_user.id,
    )

@router.post(
    "/{session_id}/message",
    response_model=ConversationMessageResponse,
)
def send_message(
    session_id: int,
    data: ConversationMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(candidate_required),
):
    return ConversationService.chat(
        db=db,
        session_id=session_id,
        candidate_id=current_user.id,
        message=data.message,
    )