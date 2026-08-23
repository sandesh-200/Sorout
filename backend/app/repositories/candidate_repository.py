from sqlalchemy.orm import Session
from models.user import User
from models.organization_membership import OrganizationMembership, MembershipRole
from models.interview_session import InterviewSession

class CandidateRepository:

    @staticmethod
    def get_all_candidates(db: Session, organization_id: int) -> list[User]:
        """Get all candidate Users in an org via membership join."""
        return (
            db.query(User)
            .join(OrganizationMembership, OrganizationMembership.user_id == User.id)
            .filter(
                OrganizationMembership.organization_id == organization_id,
                OrganizationMembership.role == MembershipRole.candidate,
            )
            .order_by(User.name.asc())
            .all()
        )

    @staticmethod
    def get_candidates_by_ids(
        db: Session,
        candidate_ids: list[int],
        organization_id: int,
    ) -> list[User]:
        """Validate candidate IDs belong to the org as candidates."""
        return (
            db.query(User)
            .join(OrganizationMembership, OrganizationMembership.user_id == User.id)
            .filter(
                User.id.in_(candidate_ids),
                OrganizationMembership.organization_id == organization_id,
                OrganizationMembership.role == MembershipRole.candidate,
            )
            .all()
        )

    @staticmethod
    def get_available_candidates(
        db: Session,
        interview_id: int,
        organization_id: int,
    ) -> list[User]:
        assigned_candidate_ids = (
            db.query(InterviewSession.candidate_id)
            .filter(InterviewSession.interview_id == interview_id)
        )
        return (
            db.query(User)
            .join(OrganizationMembership, OrganizationMembership.user_id == User.id)
            .filter(
                OrganizationMembership.organization_id == organization_id,
                OrganizationMembership.role == MembershipRole.candidate,
                ~User.id.in_(assigned_candidate_ids),
            )
            .order_by(User.name.asc())
            .all()
        )
