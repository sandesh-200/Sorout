from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from models.user import User
from services.user import candidate_required
from services.interview_session import InterviewSessionService
from schemas.interview_session import CandidateInterviewResponse



router = APIRouter(
    prefix="/interviews",tags=["Candidate-Interviews"]
)

@router.get(
    "",
    response_model=List[CandidateInterviewResponse],
)
def get_my_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(candidate_required),
):
    return InterviewSessionService.get_candidate_interviews(
        db=db,
        candidate_id=current_user.id,
    )
