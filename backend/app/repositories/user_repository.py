from sqlalchemy.orm import Session
from models.user import User
from models.organization_membership import OrganizationMembership, MembershipRole
from models.interview_session import InterviewSession

class UserRepository:

    @staticmethod
    def get_by_email(db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> User | None:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def create(db: Session, user: User) -> User:
        db.add(user)
        db.flush()
        return user


    @staticmethod
    def complete_onboarding(
        db: Session,
        user: User,
        name: str,
    ) -> User:
        """Set name + is_onboarded. Role/org handling moved to MembershipService."""
        user.name = name
        user.is_onboarded = True
        db.add(user)
        db.flush()
        return user