from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from core.database import get_db
from models.user import User
from repositories.organization_membership_repository import (
    OrganizationMembershipRepository,
)
from schemas.dashboard import AdminDashboardResponse
from services.dashboard import DashboardService
from services.user import get_current_user


router = APIRouter(
    prefix="/dashboard",
    tags=["Admin-Dashboard"],
)


def get_admin_org_context(
    db: Session,
    current_user: User,
) -> int:
    organization_id = getattr(
        current_user,
        "_jwt_org_id",
        None,
    )

    if not organization_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No organization context",
        )

    is_admin = (
        OrganizationMembershipRepository.user_is_admin_of_org(
            db=db,
            user_id=current_user.id,
            organization_id=organization_id,
        )
    )

    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return organization_id


@router.get(
    "",
    response_model=AdminDashboardResponse,
)
def get_admin_dashboard(
    activity_days: int = Query(
        default=30,
        ge=7,
        le=90,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    organization_id = get_admin_org_context(
        db=db,
        current_user=current_user,
    )

    return DashboardService.get_admin_dashboard(
        db=db,
        organization_id=organization_id,
        activity_days=activity_days,
    )