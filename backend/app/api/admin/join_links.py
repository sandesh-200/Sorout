from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from core.database import get_db
from models.user import User
from services.user import get_current_user
from services.organization_join_link import OrganizationJoinLinkService
from schemas.organization_join_link import (
    OrganizationJoinLinkResponse,
    OrganizationJoinLinkListResponse,
    CreateJoinLinkRequest
)

router = APIRouter(
    prefix="/join-links",
    tags=["Admin - Join Links"],
)


@router.post(
    "/{organization_id}",
    response_model=OrganizationJoinLinkResponse,
)
def create_join_link(
    organization_id: int,
    payload:CreateJoinLinkRequest=CreateJoinLinkRequest(),
    expires_at: datetime | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    join_link, raw_token = OrganizationJoinLinkService.create_join_link(
        db=db,
        organization_id=organization_id,
        created_by_user_id=current_user.id,
        expires_at=expires_at,
    )

    return {
        "id": join_link.id,
        "organization_id": join_link.organization_id,
        "token": raw_token,
        "expires_at": join_link.expires_at,
        "is_active": join_link.is_active,
        "created_at": join_link.created_at,
    }

@router.get(
    "/{organization_id}",
    response_model=list[OrganizationJoinLinkListResponse],
)
def get_join_links(
    organization_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return OrganizationJoinLinkService.get_active_links(
        db=db,
        organization_id=organization_id,
        user=current_user,
    )

@router.delete(
    "/{organization_id}/{link_id}",
    status_code=204,
)
def deactivate_join_link(
    organization_id: int,
    link_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    OrganizationJoinLinkService.deactivate_join_link(
        db=db,
        organization_id=organization_id,
        link_id=link_id,
        user=current_user,
    )

    return None