from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from models.user import User
from services.user import get_current_user
from services.organization_join_link import OrganizationJoinLinkService
from schemas.organization_join_link import (
    JoinLinkPreviewResponse,
    JoinOrganizationResponse,
)

router = APIRouter(
    prefix="/join-links",
    tags=["Public Join Links"],
)



@router.get(
    "/{token}/preview",
    response_model=JoinLinkPreviewResponse,
)
def preview_join_link(
    token: str,
    db: Session = Depends(get_db),
):
    join_link = OrganizationJoinLinkService.preview_join_link(
        db=db,
        token=token,
    )

    return {
        "organization_name": join_link.organization.name,
        "is_valid": True,
    }

@router.post(
    "/{token}",
    response_model=JoinOrganizationResponse,
)
def join_organization(
    token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    status, join_link = OrganizationJoinLinkService.join_organization(
        db=db,
        token=token,
        user=current_user,
    )

    return {
        "status": status,
        "organization_id": join_link.organization_id,
        "organization_name": join_link.organization.name,
        "role": "candidate",
    }