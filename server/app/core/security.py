from pwdlib import PasswordHash
from datetime import datetime, timedelta, timezone
import jwt
from app.config import settings

# .recommended() picks Argon2id — the strongest default available
password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Hash a plaintext password before storing it in MongoDB."""
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compare a login attempt's plaintext password against the stored hash."""
    return password_hash.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    """Create a signed JWT carrying the given claims (e.g. {'sub': user_id})."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decode and verify a JWT. Raises jwt.PyJWTError if invalid or expired."""
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])