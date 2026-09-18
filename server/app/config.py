from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME:  str  = "India Biz Listing"
    DEBUG:     bool = False

    # Database
    MONGODB_URI: str
    DB_NAME:     str = "indiabizdb"

    # Security
    JWT_SECRET:         str
    JWT_ALGORITHM:      str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 30   # 30 days

    # CORS — both are optional, CLIENT_URL has a default for local dev
    CLIENT_URL:      str           = "http://localhost:5173"
    CLIENT_URL_PROD: Optional[str] = None

    # Admin seed (only used by seed_admin.py — never exposed in API)
    ADMIN_EMAIL:    Optional[str] = None
    ADMIN_PASSWORD: Optional[str] = None
    ADMIN_NAME:     Optional[str] = "Admin"
    ADMIN_PHONE:    Optional[str] = None

    # Admin init endpoint secret key
    ADMIN_INIT_KEY: Optional[str] = None

    model_config = {
        "env_file":          ".env",
        "env_file_encoding": "utf-8",
        "extra":             "ignore",   # ignore unknown env vars silently
    }


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()