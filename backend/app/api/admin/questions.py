from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from services.user import get_current_user
from models.user import User
from repositories.organization_membership_repository import (
    OrganizationMembershipRepository,
)

from schemas.question import InterviewQuestionResponse
from schemas.common import MessageResponse
from services.interview import InterviewService


router = APIRouter(
    prefix="/questions",
    tags=["Admin-Questions"],
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



@router.post(
    "/{interview_id}/generate",
    response_model=MessageResponse,
)
def generate_questions(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    org_id = get_admin_org_context(db, current_user)

    return InterviewService.generate_questions(
        db=db,
        interview_id=interview_id,
        organization_id=org_id,
    )


@router.get(
    "/{interview_id}",
    response_model=list[InterviewQuestionResponse],
)
def get_interview_questions(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    org_id = get_admin_org_context(db, current_user)

    return InterviewService.get_interview_questions(
        db=db,
        interview_id=interview_id,
        organization_id=org_id,
    )


