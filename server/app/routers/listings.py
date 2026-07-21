from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.dependencies.auth import get_current_user
from app.utils.category_templates import CATEGORIES
from app.schemas.listing import ListingCreate, ListingInDB
from app.crud.listing import create_listing
from app.crud.listing import get_listings_by_user
from app.crud.listing import get_listing_by_slug, increment_views


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





# ── GET /api/listings/mine ────────────────────────────────────────────────────
@router.get("/mine")
async def get_my_listings(
    current_user: dict = Depends(get_current_user),
):
    """Returns all listings belonging to the authenticated user."""
    listings = await get_listings_by_user(str(current_user["_id"]))

    for l in listings:
        l["_id"]     = str(l["_id"])
        l["user_id"] = str(l["user_id"])

    return {
        "success": True,
        "data":    listings,
        "count":   len(listings),
    }

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

# ── GET /api/listings/{slug} ──────────────────────────────────────────────────
@router.get("/{slug}")
async def get_listing_by_slug_route(slug: str):
    """
    Public single listing page.
    Atomically increments views_total on every hit.
    This is the URL that gets indexed by Google.
    """
    listing = await get_listing_by_slug(slug)

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No listing found with slug '{slug}'",
        )

    # Increment view count without waiting for it (fire and forget)
    await increment_views(listing["_id"])

    listing["_id"]     = str(listing["_id"])
    listing["user_id"] = str(listing["user_id"])

    return {"success": True, "data": listing}