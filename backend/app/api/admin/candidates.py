from typing import List
from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.user import User
from services.user import get_current_user
from schemas.candidate import CandidateResponse
from repositories.organization_membership_repository import OrganizationMembershipRepository
from services.candidate import CandidateService

router = APIRouter(
    prefix="/candidates",tags=["Admin - Candidates"]
)


@router.get("", response_model=List[CandidateResponse])
def get_candidates(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    org_id = current_user._jwt_org_id
    if not org_id:
        raise HTTPException(status_code=403, detail="No organization context in session")
    if not OrganizationMembershipRepository.user_is_admin_of_org(db, current_user.id, org_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    return CandidateService.get_all_candidates(db=db, organization_id=org_id)

@router.get("/available/{interview_id}", response_model=List[CandidateResponse])
def get_available_candidates(interview_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    org_id = current_user._jwt_org_id
    if not org_id or not OrganizationMembershipRepository.user_is_admin_of_org(db, current_user.id, org_id):
        raise HTTPException(status_code=403, detail="Admin access required")
    return CandidateService.get_available_candidates(db=db, interview_id=interview_id, organization_id=org_id)