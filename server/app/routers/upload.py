import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/upload", tags=["upload"])

ALLOWED_TYPES  = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_SIZE_BYTES = 5 * 1024 * 1024    # 5 MB per image


@router.post("")
async def upload_image(
    file:         UploadFile = File(...),
    current_user: dict       = Depends(get_current_user),
):
    """
    Upload a single image to Cloudinary.
    Returns secure_url and public_id.
    Max size: 5MB. Allowed: jpeg, png, webp.
    """
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{file.content_type}' not allowed. Use JPEG, PNG, or WebP."
        )

    # Read and validate file size
    contents = await file.read()
    if len(contents) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5MB."
        )

    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            contents,
            folder="india-biz-listing",          # organise in one folder
            transformation=[
                {"width": 1200, "crop": "limit"}, # never store wider than 1200px
                {"quality": "auto"},               # auto-compress
                {"fetch_format": "auto"},          # serve webp to browsers that support it
            ],
        )
        return {
            "success":    True,
            "url":        result["secure_url"],
            "public_id":  result["public_id"],
            "width":      result.get("width"),
            "height":     result.get("height"),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )


@router.delete("/{public_id:path}")
async def delete_image(
    public_id:    str,
    current_user: dict = Depends(get_current_user),
):
    """
    Delete an image from Cloudinary by its public_id.
    Only authenticated users can delete — ownership checked at listing level.
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        if result.get("result") == "ok":
            return {"success": True, "message": "Image deleted"}
        raise HTTPException(status_code=400, detail="Image not found on Cloudinary")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")