from typing import List
from fastapi import APIRouter, Depends, Response,HTTPException
from repositories.organization_membership_repository import OrganizationMembershipRepository
from models.user import User
from schemas.user import CandidateResponse, UserOnboardingRequest, UserResponse
from services.user import (
    UserService,
    get_current_user,
)
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

@router.get("/candidates", response_model=List[CandidateResponse])
def get_candidates(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    org_id = current_user._jwt_org_id
    if not org_id:
        raise HTTPException(status_code=403, detail="No organization context in session")
    if not OrganizationMembershipRepository.user_is_admin_of_org(db, current_user.id, org_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    return UserService.get_all_candidates(db=db, organization_id=org_id)

@router.get("/available-candidates/{interview_id}", response_model=List[CandidateResponse])
def get_available_candidates(interview_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    org_id = current_user._jwt_org_id
    if not org_id or not OrganizationMembershipRepository.user_is_admin_of_org(db, current_user.id, org_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    return UserService.get_available_candidates(db=db, interview_id=interview_id, organization_id=org_id)