# services/user.py
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from core.database import get_db
from models.user import User
from repositories.user_repository import UserRepository
from repositories.candidate_repository import CandidateRepository
from repositories.organization_membership_repository import OrganizationMembershipRepository
from models.organization_membership import MembershipRole
from schemas.user import UserOnboardingRequest
from utils.security import hash_password, decode_token
from models.organization import Organization


class UserService:

    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return UserRepository.get_by_email(db=db, email=email)

    @staticmethod
    def create_user(db: Session, email: str, password: str, name: str = ""):
        user = User(name=name, email=email, password_hash=hash_password(password))
        return UserRepository.create(db=db, user=user)


    @staticmethod
    def complete_onboarding(
    db: Session,
    user: User,
    payload: UserOnboardingRequest,
) -> User:

        if payload.role == "admin":

            if not payload.organization_name:
                raise HTTPException(
                status_code=400,
                detail="Organization name required for admins",
            )

        # Create organization
            new_org = Organization(
            name=payload.organization_name
        )

            db.add(new_org)
            db.flush()

        # Create admin membership
            OrganizationMembershipRepository.create(
            db=db,
            user_id=user.id,
            organization_id=new_org.id,
            role=MembershipRole.admin,
        )

        elif payload.role == "candidate":

        # Candidate organization membership is handled separately
        # by OrganizationJoinLinkService after onboarding.
        #
        # Here we only complete the user's own onboarding.

            pass

        else:
            raise HTTPException(
            status_code=400,
            detail="Invalid role",
        )

        updated_user = UserRepository.complete_onboarding(
        db=db,
        user=user,
        name=payload.user_name,
    )

        db.commit()
        db.refresh(updated_user)

        return updated_user




def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:

        token = request.cookies.get("access_token")

        if not token:
            raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

        payload = decode_token(token)

        if not payload:
            raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

        user = UserRepository.get_by_id(
        db=db,
        user_id=payload["user_id"],
    )

        if not user:
            raise HTTPException(
            status_code=401,
            detail="User not found",
        )

        user._jwt_org_id = payload.get("organization_id")

        return user


def get_admin_for_org(organization_id: int):
    """
    Returns a FastAPI dependency that checks the current user is an admin
    of the given organization_id (passed as a path/query param by the caller).
    Usage: current_user: User = Depends(get_admin_for_org(org_id))
    
    BETTER PATTERN: Use require_org_admin(current_user, org_id, db) directly in endpoints.
    """
    def _inner(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> User:
        if not OrganizationMembershipRepository.user_is_admin_of_org(
            db, current_user.id, organization_id
        ):
            raise HTTPException(status_code=403, detail="Admin access required for this organization")
        return current_user
    return _inner


def admin_required(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    from models.organization_membership import MembershipRole
    admin_memberships = [
        m for m in current_user.memberships if m.role == MembershipRole.admin
    ]
    if not admin_memberships:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


def candidate_required(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    """Checks that the user has AT LEAST ONE candidate membership."""
    from models.organization_membership import MembershipRole
    candidate_memberships = [
        m for m in current_user.memberships if m.role == MembershipRole.candidate
    ]
    if not candidate_memberships:
        raise HTTPException(status_code=403, detail="Candidate access required")
    return current_user