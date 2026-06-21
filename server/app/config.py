from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    APP_NAME: str = "India Biz Listing"
    DEBUG: bool = False

    # Database
    MONGODB_URI: str
    DB_NAME: str = "indiabizdb"

    # Security
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS
    CLIENT_URL: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Cached settings — reads .env once, reuses the object."""
    return Settings()


# Convenience shortcut — import this everywhere instead of calling get_settings()
settings = get_settings()