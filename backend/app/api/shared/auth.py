from fastapi import APIRouter, Depends, HTTPException, Response,Request
from sqlalchemy.orm import Session,joinedload

from core.database import get_db
from utils.security import verify_password, create_access_token
from schemas.auth import RegisterRequest, LoginRequest,UserAuthResponse
from services.user import UserService
from models.user import User
from utils.security import decode_token
from models.organization_membership import OrganizationMembership

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
    response: Response = None,
):
    existing_user = UserService.get_user_by_email(
        db,
        data.email,
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    user = UserService.create_user(
        db,
        data.email,
        data.password,
    )

    db.commit()
    db.refresh(user)

    token = create_access_token({"user_id": user.id, "email": user.email})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24,
    )

    return {"message": "User registered successfully"}

@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
    response: Response = None,
):
    user = UserService.get_user_by_email(db, data.email)

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    membership = user.memberships[0] if user.memberships else None

    token_data = {
        "user_id": user.id,
        "email": user.email,
        "organization_id":membership.organization_id if membership else None
    }

    token = create_access_token(token_data)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60 * 24,
    )

    return {"message": "Login successful"}


@router.get("/me", response_model=UserAuthResponse)
def get_me(
    request: Request,
    db: Session = Depends(get_db),
):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = (
        db.query(User)
        .options(
            joinedload(User.memberships)
            .joinedload(OrganizationMembership.organization)
        )
        .filter(User.id == payload["user_id"])
        .first()
    )

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    memberships = [
        {
            "id": membership.id,
            "organization_id": membership.organization_id,
            "organization_name": membership.organization.name,
            "role": membership.role,
            "joined_at": membership.joined_at,
        }
        for membership in user.memberships
    ]

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_onboarded": user.is_onboarded,
        "memberships": memberships,
    }


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        samesite="lax"
    )
    return {"message": "Logged out successfully"}