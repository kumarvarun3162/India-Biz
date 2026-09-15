from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.middleware.admin import require_admin
from app.crud.admin import (
    get_platform_stats, get_growth_data, get_recent_signups,
    get_all_users, set_user_suspended,
    get_all_listings_admin, update_listing_admin, delete_listing_admin,
    get_top_listings, get_category_breakdown,
)
from app.schemas.admin import SuspendUserRequest, UpdateListingAdminRequest

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _ser(doc: dict) -> dict:
    """Serialize ObjectIds to strings."""
    if not doc:
        return doc
    doc = dict(doc)
    for k in ["_id", "user_id"]:
        if k in doc:
            doc[k] = str(doc[k])
    return doc


# ── GET /api/admin/stats ──────────────────────────────────────────────────────
@router.get("/stats")
async def platform_stats(admin=Depends(require_admin)):
    stats  = await get_platform_stats()
    growth = await get_growth_data()
    recent = await get_recent_signups()
    return {
        "success": True,
        "stats":   stats,
        "growth":  growth,
        "recent_signups": [_ser(u) for u in recent],
    }