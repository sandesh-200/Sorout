from pydantic import BaseModel,Field
from schemas.membership import MembershipResponse

class UserResponse(BaseModel):
    id: int
    name: str | None = None
    email: str
    is_onboarded: bool
    memberships: list[MembershipResponse] = []

    model_config = {"from_attributes": True}

class UserOnboardingRequest(BaseModel):
    role: str
    user_name: str = Field(..., min_length=1, max_length=100)
    organization_name: str | None = Field(
        None,
        min_length=1,
        max_length=100,
    )