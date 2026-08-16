from typing import List
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.user import User
from schemas.user import CandidateResponse, UserOnboardingRequest, UserResponse
from services.user import (
    UserService,
    admin_required,
    get_current_user,
)
from utils.security import create_access_token

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post(
    "/onboarding",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
)
def complete_onboarding(
    payload: UserOnboardingRequest,
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated_user = UserService.complete_onboarding(
        db=db,
        user=current_user,
        payload=payload,
    )
    token = create_access_token({
        "user_id": updated_user.id,
        "email": updated_user.email,
        "role": updated_user.role.value,
        "organization_id": updated_user.organization_id,
    })

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24,
    )

    return updated_user


@router.get(
    "/candidates",
    response_model=List[CandidateResponse],
)
def get_candidates(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return UserService.get_all_candidates(db=db, organization_id=current_user.organization_id)


@router.get(
    "/available-candidates/{interview_id}",
    response_model=List[CandidateResponse],
)
def get_available_candidates(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return UserService.get_available_candidates(
        db=db,
        interview_id=interview_id,
        organization_id=current_user.organization_id,
    )