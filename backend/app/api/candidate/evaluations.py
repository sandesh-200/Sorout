from fastapi import APIRouter, Depends, BackgroundTasks, Request, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from core.database import get_db
from services.user import candidate_required
from services.evaluation import EvaluationService
from schemas.evaluation import InterviewEvaluationResponse
from models.user import User
from models.interview_session import InterviewSessionStatus
from repositories.interview_session_repository import InterviewSessionRepository


router = APIRouter(
    prefix="/evaluations",
    tags=["Candidate - Evaluation"],
)


@router.post("/{session_id}/evaluate")
def evaluate(
    session_id: int,
    request: Request,
    background_tasks: BackgroundTasks,
):
    pipeline = request.app.state.segmentation_pipeline

    background_tasks.add_task(
        EvaluationService.evaluate_session,
        session_id=session_id,
        pipeline=pipeline,
    )

    return {
        "message": "Evaluation started. Check back shortly for results."
    }


@router.get(
    "/{session_id}/result",
    response_model=InterviewEvaluationResponse,
)
def get_result(
    session_id: int,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(candidate_required),
):
    try:
        return EvaluationService.get_result(
            db=db,
            session_id=session_id,
            candidate_id=current_user.id,
        )
    except HTTPException as e:
        if e.status_code == 404 and e.detail == "Evaluation not found":
            # Auto-start evaluation if the session is completed but not yet evaluated
            session = InterviewSessionRepository.get_by_id(db, session_id)
            if session and session.status == InterviewSessionStatus.completed:
                pipeline = request.app.state.segmentation_pipeline
                background_tasks.add_task(
                    EvaluationService.evaluate_session,
                    session_id=session_id,
                    pipeline=pipeline,
                )
                return JSONResponse(
                    status_code=202,
                    content={
                        "status": "evaluating",
                        "message": "Evaluation in progress",
                    },
                )
        raise e