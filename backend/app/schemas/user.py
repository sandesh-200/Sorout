from pydantic import BaseModel,Field
from models.user import UserRole


class CandidateResponse(BaseModel):
    id: int
    name: str
    email: str

    model_config = {
        "from_attributes": True
    }

class UserResponse(BaseModel):
    id: int
    name: str | None = None
    email: str
    role: UserRole
    is_onboarded: bool

    model_config = {
        "from_attributes": True
    }

class UserOnboardingRequest(BaseModel):
    role: UserRole
    user_name: str = Field(..., min_length=1, max_length=100)
    organization_name: str | None = Field(None, min_length=1, max_length=100)

    class Config:
        from_attributes = True