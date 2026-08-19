from schemas.membership import MembershipResponse
from pydantic import BaseModel, EmailStr,Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    send_verification: bool = False


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserAuthResponse(BaseModel):
    id: int
    name: str | None = None
    email: EmailStr
    is_onboarded: bool
    memberships: list[MembershipResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True}