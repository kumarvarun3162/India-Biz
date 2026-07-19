from datetime import datetime
from typing import Annotated, Optional
from pydantic import BaseModel, EmailStr, Field, BeforeValidator

# Lets Pydantic accept MongoDB's ObjectId and serialize it as a plain string
PyObjectId = Annotated[str, BeforeValidator(str)]


class UserCreate(BaseModel):
    """Incoming shape for POST /api/auth/register"""
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """Incoming shape for POST /api/auth/login"""
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    """Outgoing shape — never includes password_hash"""
    id: PyObjectId = Field(alias="_id")
    full_name: str
    email: EmailStr
    phone: str
    role: str = "user"
    subscription_tier: str = "free"
    subscription_expires: Optional[datetime] = None
    created_at: datetime

    class Config:
        populate_by_name = True


class Token(BaseModel):
    """Returned after successful register or login"""
    access_token: str
    token_type: str = "bearer"
    user: UserPublic