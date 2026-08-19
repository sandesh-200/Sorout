from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.organization_join_link import (
    OrganizationJoinLink,
    generate_join_token,
    hash_join_token,
)
from models.organization_membership import MembershipRole
from models.user import User

from repositories.organization_join_link_repository import (
    OrganizationJoinLinkRepository,
)
from repositories.organization_membership_repository import (
    OrganizationMembershipRepository,
)


class OrganizationJoinLinkService:

    @staticmethod
    def create_join_link(
        db: Session,
        organization_id: int,
        created_by_user_id: int,
        expires_at=None,
    ) -> tuple[OrganizationJoinLink, str]:

        # Make sure the user creating the link is an admin
        is_admin = OrganizationMembershipRepository.user_is_admin_of_org(
            db,
            created_by_user_id,
            organization_id,
        )

        if not is_admin:
            raise HTTPException(
                status_code=403,
                detail="Admin access required",
            )

        # Generate the raw token.
        # This is the ONLY place where we have the plaintext token.
        raw_token = generate_join_token()

        # Only the hash goes into the database.
        token_hash = hash_join_token(raw_token)

        join_link = OrganizationJoinLinkRepository.create(
            db=db,
            organization_id=organization_id,
            created_by_user_id=created_by_user_id,
            token_hash=token_hash,
            expires_at=expires_at,
        )

        db.commit()
        db.refresh(join_link)

        return join_link, raw_token

    @staticmethod
    def preview_join_link(
        db: Session,
        token: str,
    ) -> OrganizationJoinLink:

        token_hash = hash_join_token(token)

        join_link = (
            OrganizationJoinLinkRepository.get_by_token_hash(
                db,
                token_hash,
            )
        )

        if not join_link:
            raise HTTPException(
                status_code=404,
                detail="Invalid join link",
            )

        if not join_link.is_active:
            raise HTTPException(
                status_code=404,
                detail="This join link is no longer active",
            )

        if (
            join_link.expires_at
            and join_link.expires_at < datetime.now(timezone.utc)
        ):
            raise HTTPException(
                status_code=404,
                detail="This join link has expired",
            )

        return join_link

    @staticmethod
    def join_organization(
        db: Session,
        token: str,
        user: User,
    ) -> tuple[str, OrganizationJoinLink]:

        # Hash the token supplied by the user.
        token_hash = hash_join_token(token)

        join_link = (
            OrganizationJoinLinkRepository.get_by_token_hash(
                db,
                token_hash,
            )
        )

        if not join_link:
            raise HTTPException(
                status_code=404,
                detail="Invalid join link",
            )

        if not join_link.is_active:
            raise HTTPException(
                status_code=404,
                detail="This join link is no longer active",
            )

        if (
            join_link.expires_at
            and join_link.expires_at < datetime.now(timezone.utc)
        ):
            raise HTTPException(
                status_code=404,
                detail="This join link has expired",
            )

        # Check whether this user already belongs to the organization.
        existing_membership = (
            OrganizationMembershipRepository.get_by_user_and_org(
                db,
                user.id,
                join_link.organization_id,
            )
        )

        if existing_membership:
            return "already_member", join_link

        # New membership
        OrganizationMembershipRepository.create(
            db=db,
            user_id=user.id,
            organization_id=join_link.organization_id,
            role=MembershipRole.candidate,
        )

        db.commit()

        return "joined", join_link

    @staticmethod
    def get_active_links(
        db: Session,
        organization_id: int,
        user: User,
    ) -> list[OrganizationJoinLink]:

        is_admin = OrganizationMembershipRepository.user_is_admin_of_org(
            db,
            user.id,
            organization_id,
        )

        if not is_admin:
            raise HTTPException(
                status_code=403,
                detail="Admin access required",
            )

        return OrganizationJoinLinkRepository.get_active_for_org(
            db,
            organization_id,
        )

    @staticmethod
    def deactivate_join_link(
        db: Session,
        organization_id: int,
        link_id: int,
        user: User,
    ) -> None:

        is_admin = OrganizationMembershipRepository.user_is_admin_of_org(
            db,
            user.id,
            organization_id,
        )

        if not is_admin:
            raise HTTPException(
                status_code=403,
                detail="Admin access required",
            )

        join_link = OrganizationJoinLinkRepository.get_by_id(
            db,
            link_id,
        )

        if not join_link:
            raise HTTPException(
                status_code=404,
                detail="Join link not found",
            )

        if join_link.organization_id != organization_id:
            raise HTTPException(
                status_code=404,
                detail="Join link not found",
            )

        OrganizationJoinLinkRepository.deactivate(
            db,
            join_link,
        )

        db.commit()