from sqlalchemy.orm import Session
from models.organization_membership import OrganizationMembership, MembershipRole
from typing import Optional

class OrganizationMembershipRepository:

    @staticmethod
    def get_by_user_and_org(
        db: Session,
        user_id: int,
        organization_id: int
    ) -> Optional[OrganizationMembership]:
        return (
            db.query(OrganizationMembership)
            .filter(
                OrganizationMembership.user_id == user_id,
                OrganizationMembership.organization_id == organization_id,
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        organization_id: int,
        role: MembershipRole,
    ) -> OrganizationMembership:
        membership = OrganizationMembership(
            user_id=user_id,
            organization_id=organization_id,
            role=role,
        )
        db.add(membership)
        db.flush()
        return membership

    @staticmethod
    def get_user_memberships(
        db: Session,
        user_id: int,
    ) -> list[OrganizationMembership]:
        return (
            db.query(OrganizationMembership)
            .filter(OrganizationMembership.user_id == user_id)
            .all()
        )

    @staticmethod
    def get_candidates_in_org(
        db: Session,
        organization_id: int,
    ) -> list[OrganizationMembership]:
        """Return all candidate memberships for an org (includes user via join)."""
        return (
            db.query(OrganizationMembership)
            .filter(
                OrganizationMembership.organization_id == organization_id,
                OrganizationMembership.role == MembershipRole.candidate,
            )
            .all()
        )

    @staticmethod
    def get_candidates_by_ids_in_org(
        db: Session,
        user_ids: list[int],
        organization_id: int,
    ) -> list[OrganizationMembership]:
        return (
            db.query(OrganizationMembership)
            .filter(
                OrganizationMembership.user_id.in_(user_ids),
                OrganizationMembership.organization_id == organization_id,
                OrganizationMembership.role == MembershipRole.candidate,
            )
            .all()
        )

    @staticmethod
    def user_is_admin_of_org(
        db: Session,
        user_id: int,
        organization_id: int,
    ) -> bool:
        return (
            db.query(OrganizationMembership)
            .filter(
                OrganizationMembership.user_id == user_id,
                OrganizationMembership.organization_id == organization_id,
                OrganizationMembership.role == MembershipRole.admin,
            )
            .first()
        ) is not None

    @staticmethod
    def user_is_candidate_of_org(
        db: Session,
        user_id: int,
        organization_id: int,
    ) -> bool:
        return (
            db.query(OrganizationMembership)
            .filter(
                OrganizationMembership.user_id == user_id,
                OrganizationMembership.organization_id == organization_id,
                OrganizationMembership.role == MembershipRole.candidate,
            )
            .first()
        ) is not None