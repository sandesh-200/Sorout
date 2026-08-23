from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from services.user import get_current_user
from models.user import User
from repositories.organization_membership_repository import (
    OrganizationMembershipRepository,
)

from schemas.interview import (
    AssignCandidatesResponse,
    AssignCandidatesRequest,
    InterviewCreate,
    InterviewResponse,
    InterviewUpdate,
)
from services.interview import InterviewService


router = APIRouter(
    prefix="/interviews",
    tags=["Admin-Interviews"],
)


def get_admin_org_context(
    db: Session,
    current_user: User,
) -> int:
    org_id = getattr(current_user, "_jwt_org_id", None)

    if not org_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No organization context",
        )

    if not OrganizationMembershipRepository.user_is_admin_of_org(
        db,
        current_user.id,
        org_id,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return org_id


@router.post("", response_model=InterviewResponse, status_code=201)
def create_interview(
    data: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    org_id = get_admin_org_context(db, current_user)

    return InterviewService.create_interview(
        db=db,
        data=data,
        admin_id=current_user.id,
        organization_id=org_id,
    )


@router.get("", response_model=List[InterviewResponse])
def get_all_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    org_id = get_admin_org_context(db, current_user)

    return InterviewService.get_all_interviews(
        db=db,
        organization_id=org_id,
    )


@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    org_id = get_admin_org_context(db, current_user)

    return InterviewService.get_interview(
        db=db,
        interview_id=interview_id,
        organization_id=org_id,
    )


@router.patch("/{interview_id}", response_model=InterviewResponse)
def update_interview(
    interview_id: int,
    data: InterviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    org_id = get_admin_org_context(db, current_user)

    return InterviewService.update_interview(
        db=db,
        interview_id=interview_id,
        data=data,
        organization_id=org_id,
    )


@router.delete(
    "/{interview_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    org_id = get_admin_org_context(db, current_user)

    InterviewService.delete_interview(
        db=db,
        interview_id=interview_id,
        organization_id=org_id,
    )



@router.post(
    "/{interview_id}/assign",
    response_model=AssignCandidatesResponse,
)
def assign_candidates(
    interview_id: int,
    data: AssignCandidatesRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    org_id = get_admin_org_context(db, current_user)

    return InterviewService.assign_candidates(
        db=db,
        interview_id=interview_id,
        candidate_ids=data.candidate_ids,
        organization_id=org_id,
    )