from fastapi import APIRouter, Depends,BackgroundTasks
from sqlalchemy.orm import Session

from core.database import get_db
from services.user import candidate_required
from services.evaluation import EvaluationService
from schemas.evaluation import InterviewEvaluationResponse
from models.user import User

router = APIRouter(
    prefix="/evaluations",
    tags=["Candidate - Evaluation"],
)


@router.post("/{session_id}/evaluate")
def evaluate(
    session_id: int,
    background_tasks:BackgroundTasks,
    db: Session = Depends(get_db),
):
    background_tasks.add_task(
        EvaluationService.evaluate_session,
        db=db,session_id=session_id
    )
    
    return {"message": "Evaluation started. Check back shortly for results."}

@router.get(
    "/{session_id}/result",
    response_model=InterviewEvaluationResponse,
)
def get_result(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(candidate_required),
):
    return EvaluationService.get_result(
        db=db,
        session_id=session_id,
        candidate_id=current_user.id
    )