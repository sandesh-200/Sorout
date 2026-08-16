from fastapi import APIRouter, Depends,status
from sqlalchemy.orm import Session

from core.database import get_db
from services.user import admin_required
from models.user import User
from schemas.question import InterviewQuestionResponse

from schemas.interview import AssignCandidatesResponse,AssignCandidatesRequest
from schemas.interview import (
    InterviewCreate,
    InterviewResponse,
    InterviewUpdate
)
from services.interview import InterviewService
from typing import List
from schemas.common import MessageResponse

router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"],
)


@router.post("",response_model=InterviewResponse,status_code=201)
def create_interview(
    data: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return InterviewService.create_interview(
        db=db,
        data=data,
        admin_id=current_user.id,
        organization_id=current_user.organization_id,
    )

@router.get("",response_model=List[InterviewResponse])
def get_all_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return InterviewService.get_all_interviews(db=db, organization_id=current_user.organization_id)

@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return InterviewService.get_interview(
        db=db,
        interview_id=interview_id,
        organization_id=current_user.organization_id,
    )

@router.patch("/{interview_id}",response_model=InterviewResponse)
def update_interview(
    interview_id: int,
    data: InterviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return InterviewService.update_interview(
        db=db,
        interview_id=interview_id,
        data=data,
        organization_id=current_user.organization_id,
    )

@router.delete("/{interview_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    InterviewService.delete_interview(
        db=db,
        interview_id=interview_id,
        organization_id=current_user.organization_id,
    )

@router.post(
    "/{interview_id}/generate-questions",
    response_model=MessageResponse,
)
def generate_questions(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return InterviewService.generate_questions(
        db=db,
        interview_id=interview_id,
        organization_id=current_user.organization_id,
    )

@router.get(
    "/{interview_id}/questions",
    response_model=list[InterviewQuestionResponse],
)
def get_interview_questions(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return InterviewService.get_interview_questions(
        db=db,
        interview_id=interview_id,
        organization_id=current_user.organization_id,
    )

@router.post(
    "/{interview_id}/assign",
    response_model=AssignCandidatesResponse,
)
def assign_candidates(
    interview_id: int,
    data: AssignCandidatesRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return InterviewService.assign_candidates(
        db=db,
        interview_id=interview_id,
        candidate_ids=data.candidate_ids,
        organization_id=current_user.organization_id,
    )