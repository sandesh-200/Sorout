from fastapi import APIRouter, Depends,status
from sqlalchemy.orm import Session
from core.database import get_db
from services.user import candidate_required
from schemas.interview_session import InterviewSessionResponse,NextQuestionResponse,CandidateInterviewResponse
from schemas.answer import SubmitAnswerRequest
from models.user import User
from typing import List
from services.interview_session import InterviewSessionService,CurrentQuestionResponse

router = APIRouter(
    prefix="/interview_session",
    tags=["Interview Session"],
)

@router.post(
    "/{session_id}/start",
    response_model=InterviewSessionResponse,
)
def start_interview(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(candidate_required),
):
    return InterviewSessionService.start_interview(
        db=db,
        session_id=session_id,
        candidate_id=current_user.id,
    )

@router.get(
    "/{session_id}/current-question",
    response_model=CurrentQuestionResponse,
)
def get_current_question(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(candidate_required),
):
    return InterviewSessionService.get_current_question(
        db=db,
        session_id=session_id,
        candidate_id=current_user.id,
    )

@router.post(
    "/{session_id}/answers",
    response_model=NextQuestionResponse,
)
def submit_answer(
    session_id: int,
    data: SubmitAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(candidate_required),
):
    return InterviewSessionService.submit_answer(
        db=db,
        session_id=session_id,
        candidate_id=current_user.id,
        question_id=data.question_id,
        answer_text=data.answer_text,
    )
