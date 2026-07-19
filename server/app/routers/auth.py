from fastapi import APIRouter, HTTPException, status
from app.schemas.user import UserCreate, UserPublic, Token
from app.crud.user import get_user_by_email, create_user
from app.core.security import hash_password, create_access_token
from app.schemas.user import UserLogin
from app.core.security import verify_password
from fastapi import Request
from app.core.limiter import limiter

router = APIRouter(prefix="/api/auth", tags=["auth"])
@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(request: Request, payload: UserCreate):
    existing = await get_user_by_email(payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )

    hashed = hash_password(payload.password)
    user = await create_user(
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        password_hash=hashed,
    )

    token = create_access_token({"sub": str(user["_id"])})
    return Token(access_token=token, user=UserPublic(**user))



@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
async def login(request: Request, payload: UserLogin):
    user = await get_user_by_email(payload.email)

    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token({"sub": str(user["_id"])})
    return Token(access_token=token, user=UserPublic(**user))