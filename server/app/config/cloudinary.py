import cloudinary
from app.config import settings


def init_cloudinary():
    """
    Initialize Cloudinary with credentials from environment.
    Called once during app startup from lifespan.
    """
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,          # always use https URLs
    )
    print("✅  Cloudinary initialized")