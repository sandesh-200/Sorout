from sqlalchemy.orm import Session

from models.organization_join_link import OrganizationJoinLink


class OrganizationJoinLinkRepository:

    @staticmethod
    def create(
        db: Session,
        organization_id: int,
        created_by_user_id: int,
        token_hash: str,
        expires_at=None,
    ) -> OrganizationJoinLink:

        join_link = OrganizationJoinLink(
            organization_id=organization_id,
            created_by_user_id=created_by_user_id,
            token_hash=token_hash,
            expires_at=expires_at,
            is_active=True,
        )

        db.add(join_link)
        db.flush()

        return join_link

    @staticmethod
    def get_by_token_hash(
        db: Session,
        token_hash: str,
    ) -> OrganizationJoinLink | None:

        return (
            db.query(OrganizationJoinLink)
            .filter(
                OrganizationJoinLink.token_hash == token_hash
            )
            .first()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        link_id: int,
    ) -> OrganizationJoinLink | None:

        return (
            db.query(OrganizationJoinLink)
            .filter(OrganizationJoinLink.id == link_id)
            .first()
        )

    @staticmethod
    def get_active_for_org(
        db: Session,
        organization_id: int,
    ) -> list[OrganizationJoinLink]:

        return (
            db.query(OrganizationJoinLink)
            .filter(
                OrganizationJoinLink.organization_id == organization_id,
                OrganizationJoinLink.is_active.is_(True),
            )
            .all()
        )

    @staticmethod
    def deactivate(
        db: Session,
        join_link: OrganizationJoinLink,
    ) -> OrganizationJoinLink:

        join_link.is_active = False
        db.add(join_link)
        db.flush()

        return join_link