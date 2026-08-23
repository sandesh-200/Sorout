from typing import List
from fastapi import APIRouter, Depends, Response,HTTPException
from repositories.organization_membership_repository import OrganizationMembershipRepository
from models.user import User
from schemas.user import UserOnboardingRequest, UserResponse
from schemas.candidate import CandidateResponse
from services.user import (
    UserService,
    get_current_user,
)
from services.candidate import CandidateService
from sqlalchemy.orm import Session
from core.database import get_db
from utils.security import create_access_token

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.post("/onboarding", response_model=UserResponse, status_code=200)
def complete_onboarding(
    payload: UserOnboardingRequest,
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated_user = UserService.complete_onboarding(
        db,
        current_user,
        payload,
    )

    membership = (
        updated_user.memberships[0]
        if updated_user.memberships
        else None
    )

    token = create_access_token({
        "user_id": updated_user.id,
        "email": updated_user.email,
        "organization_id": membership.organization_id if membership else None,
    })

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=86400,
    )

    memberships = [
        {
            "id": membership.id,
            "organization_id": membership.organization_id,
            "organization_name": membership.organization.name,
            "role": membership.role,
            "joined_at": membership.joined_at,
        }
        for membership in updated_user.memberships
    ]

    return {
        "id": updated_user.id,
        "name": updated_user.name,
        "email": updated_user.email,
        "is_onboarded": updated_user.is_onboarded,
        "memberships": memberships,
    }

