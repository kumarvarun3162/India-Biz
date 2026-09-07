from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.dependencies.auth import get_current_user, verify_listing_owner
from app.utils.category_templates import CATEGORIES
from app.schemas.listing import ListingCreate, ListingUpdate, ListingInDB
from app.crud.listing import (
    create_listing, get_listing_by_slug, get_listings_by_user,
    search_listings, update_listing, increment_views, delete_listing
)

router = APIRouter(prefix="/api/listings", tags=["listings"])


# ── Serializer helper ─────────────────────────────────────────────────────────
def serialize_listing(listing: dict) -> dict:
    if listing is None:
        return listing
    listing = dict(listing)
    if "_id" in listing:
        listing["_id"] = str(listing["_id"])
    if "user_id" in listing:
        listing["user_id"] = str(listing["user_id"])
    return listing


def serialize_hours(payload_hours) -> dict:
    if not payload_hours:
        return {}
    return {
        day: {
            "open":   getattr(payload_hours, day).open,
            "close":  getattr(payload_hours, day).close,
            "closed": getattr(payload_hours, day).closed,
        }
        for day in ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    }


# ── GET /api/listings/categories ─────────────────────────────────────────────
@router.get("/categories")
async def get_categories():
    return {"success": True, "categories": CATEGORIES}


# ── GET /api/listings/mine ────────────────────────────────────────────────────
# IMPORTANT: /mine must come before /{slug} or FastAPI matches "mine" as a slug
@router.get("/mine")
async def get_my_listings(current_user: dict = Depends(get_current_user)):
    try:
        listings = await get_listings_by_user(str(current_user["_id"]))
        return {
            "success": True,
            "data":    [serialize_listing(l) for l in listings],
            "count":   len(listings),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch listings: {str(e)}")


# ── POST /api/listings ────────────────────────────────────────────────────────
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_new_listing(
    payload: ListingCreate,
    current_user: dict = Depends(get_current_user),
):
    try:
        data = payload.model_dump()
        data["hours"] = serialize_hours(payload.hours)

        listing = await create_listing(
            user_id=str(current_user["_id"]),
            data=data,
        )
        return {"success": True, "data": serialize_listing(listing)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create listing: {str(e)}")


# ── GET /api/listings ─────────────────────────────────────────────────────────
@router.get("")
async def list_listings(
    city:     str | None = Query(None),
    category: str | None = Query(None),
    search:   str | None = Query(None),
    page:     int        = Query(1, ge=1),
    limit:    int        = Query(12, ge=1, le=50),
):
    try:
        listings, total = await search_listings(
            city=city, category=category,
            search=search, page=page, limit=limit,
        )
        return {
            "success": True,
            "data": [serialize_listing(l) for l in listings],
            "pagination": {
                "page":        page,
                "limit":       limit,
                "total":       total,
                "total_pages": max(1, -(-total // limit)),
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


# ── GET /api/listings/{slug} ──────────────────────────────────────────────────
@router.get("/{slug}")
async def get_listing_by_slug_route(slug: str):
    try:
        listing = await get_listing_by_slug(slug)
        if not listing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No listing found with slug '{slug}'",
            )
        await increment_views(listing["_id"])
        return {"success": True, "data": serialize_listing(listing)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch listing: {str(e)}")


# ── PUT /api/listings/{listing_id} ────────────────────────────────────────────
@router.put("/{listing_id}")
async def update_existing_listing(
    listing_id: str,
    payload:    ListingUpdate,
    listing:    dict = Depends(verify_listing_owner),
):
    updates = payload.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    if "hours" in updates and payload.hours:
        updates["hours"] = serialize_hours(payload.hours)

    updated = await update_listing(listing_id, updates)
    return {"success": True, "data": serialize_listing(updated)}


# ── DELETE /api/listings/{listing_id} ─────────────────────────────────────────
@router.delete("/{listing_id}")
async def delete_existing_listing(
    listing_id: str,
    listing:    dict = Depends(verify_listing_owner),
):
    deleted = await delete_listing(listing_id)
    if not deleted:
        raise HTTPException(status_code=500, detail="Failed to delete listing")
    return {"success": True, "message": "Listing deleted successfully"}