from pydantic import BaseModel, EmailStr
from models.user import UserRole


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
    role: UserRole
    is_onboarded: bool

    model_config = {
        "from_attributes": True
    }