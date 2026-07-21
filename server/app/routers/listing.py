from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.dependencies.auth import get_current_user
from app.utils.category_templates import CATEGORIES
from app.schemas.listing import ListingCreate, ListingInDB
from app.crud.listing import create_listing


router = APIRouter(prefix="/api/listings", tags=["listings"])


# ── GET /api/listings/categories ─────────────────────────────────────────────
@router.post("", response_model=ListingInDB, status_code=status.HTTP_201_CREATED)
async def create_new_listing(
    payload: ListingCreate,
    current_user: dict = Depends(get_current_user),
):
    """
    Create a new listing for the authenticated user.
    Slug is auto-generated from business_name + random suffix.
    """
    # Convert Pydantic model → plain dict, keeping nested models as dicts
    data = payload.model_dump()

    # Convert BusinessHours nested model to plain dict
    data["hours"] = payload.hours.model_dump()

    listing = await create_listing(
        user_id=str(current_user["_id"]),
        data=data,
    )
    return listing


@router.get("/categories")
async def get_categories():
    """
    Returns all supported business categories with their templates.
    Used by the frontend to populate the category selector and
    auto-fill the form when a category is chosen.
    """
    return {
        "success": True,
        "categories": CATEGORIES,
    }