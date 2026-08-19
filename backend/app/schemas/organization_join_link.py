from datetime import datetime

from pydantic import BaseModel


class JoinLinkPreviewResponse(BaseModel):
    organization_name: str
    is_valid: bool = True


class JoinOrganizationResponse(BaseModel):
    status: str  # "joined" | "already_member"
    organization_id: int
    organization_name: str
    role: str


class OrganizationJoinLinkResponse(BaseModel):
    id: int
    organization_id: int
    token: str
    expires_at: datetime | None
    is_active: bool
    created_at: datetime


class OrganizationJoinLinkListResponse(BaseModel):
    id: int
    organization_id: int
    expires_at: datetime | None
    is_active: bool
    created_at: datetime