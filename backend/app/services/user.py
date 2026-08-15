from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from core.database import get_db

from models.user import User
from schemas.user import UserOnboardingRequest
from repositories.user_repository import UserRepository

from utils.security import (
    hash_password,
    decode_token,
)


class UserService:

    @staticmethod
    def get_user_by_email(
        db: Session,
        email: str,
    ):
        return UserRepository.get_by_email(
            db=db,
            email=email,
        )

    @staticmethod
    def create_user(
        db: Session,
        email: str,
        password: str,
        name: str = "",
    ):
        user = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
        )

        user =  UserRepository.create(
            db=db,
            user=user,
        )

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_all_candidates(
        db: Session,
    ):
        return UserRepository.get_all_candidates(db)
    
    @staticmethod
    def get_available_candidates(
        db: Session,
        interview_id: int,
    ):
        return UserRepository.get_available_candidates(
            db=db,
            interview_id=interview_id,
        )


    @staticmethod
    def complete_onboarding(
        db: Session,
        user: User,
        payload: UserOnboardingRequest,
    ) -> User:
        updated_user = UserRepository.complete_onboarding(
            db=db,
            user=user,
            role=payload.role,
            name=payload.displayName,
        )
        db.commit()
        db.refresh(updated_user)
        return updated_user

def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    # user = db.query(User).filter(User.id == payload["user_id"]).first()
    user = UserRepository.get_by_id(db=db,user_id=payload["user_id"],)

    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    user.jwt_role = payload.get("role")

    return user


def admin_required(current_user: User = Depends(get_current_user)):
    # Always check the actual database model role, not the stale JWT claim
    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return current_user


def candidate_required(current_user: User = Depends(get_current_user)):
    if current_user.role.value != "candidate":
        raise HTTPException(
            status_code=403, detail="Candidate access required"
        )

    return current_user