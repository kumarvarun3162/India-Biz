from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional
import cloudinary


class Settings(BaseSettings):
    APP_NAME:  str  = "India Biz Listing"
    DEBUG:     bool = False

    MONGODB_URI: str
    DB_NAME:     str = "indiabizdb"

    JWT_SECRET:         str
    JWT_ALGORITHM:      str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 30

    CLIENT_URL:      str           = "http://localhost:5173"
    CLIENT_URL_PROD: Optional[str] = None

    ADMIN_EMAIL:    Optional[str] = None
    ADMIN_PASSWORD: Optional[str] = None
    ADMIN_NAME:     Optional[str] = "Admin"
    ADMIN_PHONE:    Optional[str] = None
    ADMIN_INIT_KEY: Optional[str] = None

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY:    Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

    model_config = {
        "env_file":          ".env",
        "env_file_encoding": "utf-8",
        "extra":             "ignore",
    }


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()


def init_cloudinary():
    """Initialize Cloudinary — called once from app lifespan."""
    if not settings.CLOUDINARY_CLOUD_NAME:
        print("⚠️  Cloudinary not configured — skipping")
        return
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )
    print("✅  Cloudinary initialized")