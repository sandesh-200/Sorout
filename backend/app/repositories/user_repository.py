from sqlalchemy.orm import Session

from models.user import User, UserRole
from models.interview_session import InterviewSession


class UserRepository:

    @staticmethod
    def get_by_email(
        db: Session,
        email: str,
    ):
        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: int,
    ):
        return (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        user: User,
    ):
        db.add(user)
        db.flush()
        return user

    @staticmethod
    def get_all_candidates(
        db: Session,
        organization_id: int,
    ):
        return (
            db.query(User)
            .filter(
                User.role == UserRole.candidate,
                User.organization_id == organization_id,
            )
            .order_by(User.name.asc())
            .all()
        )

    @staticmethod
    def get_candidates_by_ids(
        db: Session,
        candidate_ids: list[int],
        organization_id: int,
    ):
        return (
            db.query(User)
            .filter(
                User.id.in_(candidate_ids),
                User.role == UserRole.candidate,
                User.organization_id == organization_id,
            )
            .all()
        )
    
    @staticmethod
    def get_available_candidates(
        db: Session,
        interview_id: int,
        organization_id: int,
    ):
        assigned_candidate_ids = (
            db.query(InterviewSession.candidate_id)
            .filter(
                InterviewSession.interview_id == interview_id
            )
        )

        return (
            db.query(User)
            .filter(
                User.role == UserRole.candidate,
                ~User.id.in_(assigned_candidate_ids),
                User.organization_id == organization_id,
            )
            .order_by(User.name.asc())
            .all()
        )

    @staticmethod
    def complete_onboarding(
        db: Session,
        user: User,
        role: UserRole,
        name: str,
        organization_name: str | None = None,
    )->User:
        from models.organization import Organization
        from fastapi import HTTPException
        
        user.role = role
        user.name = name
        
        if role == UserRole.admin:
            if not organization_name:
                raise HTTPException(status_code=400, detail="Organization name is required for admins")
            
            new_org = Organization(name=organization_name)
            db.add(new_org)
            db.flush()
            user.organization_id = new_org.id
            
        user.is_onboarded = True
        db.add(user)
        db.flush()
        return user