from fastapi import APIRouter, Depends, HTTPException, Query
from app.middleware.admin import require_admin
from app.crud.admin import (
    get_platform_stats,
    get_growth_data,
    get_recent_signups,
    get_all_users,
    set_user_suspended,
    get_all_listings_admin,
    update_listing_admin,
    delete_listing_admin,
    get_top_listings,
    get_category_breakdown,
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
    stats = await get_platform_stats()
    growth = await get_growth_data()
    recent = await get_recent_signups()
    return {
        "success": True,
        "stats": stats,
        "growth": growth,
        "recent_signups": [_ser(u) for u in recent],
    }


# ── GET /api/admin/users ──────────────────────────────────────────────────────
@router.get("/users")
async def list_all_users(
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin=Depends(require_admin),
):
    users, total = await get_all_users(search=search, page=page, limit=limit)
    return {
        "success": True,
        "data": [_ser(u) for u in users],
        "pagination": {
            "page": page,
            "total": total,
            "total_pages": max(1, -(-total // limit)),
        },
    }


# ── PATCH /api/admin/users/{user_id}/suspend ─────────────────────────────────
@router.patch("/users/{user_id}/suspend")
async def suspend_user(
    user_id: str,
    payload: SuspendUserRequest,
    admin=Depends(require_admin),
):
    user = await set_user_suspended(user_id, payload.is_suspended)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    action = "suspended" if payload.is_suspended else "restored"
    return {"success": True, "message": f"User {action} successfully", "data": _ser(user)}


# ── GET /api/admin/listings ───────────────────────────────────────────────────
@router.get("/listings")
async def list_all_listings(
    search: str | None = Query(None),
    category: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin=Depends(require_admin),
):
    listings, total = await get_all_listings_admin(
        search=search, category=category, page=page, limit=limit
    )
    return {
        "success": True,
        "data": [_ser(l) for l in listings],
        "pagination": {
            "page": page,
            "total": total,
            "total_pages": max(1, -(-total // limit)),
        },
    }


# ── PATCH /api/admin/listings/{listing_id} ────────────────────────────────────
@router.patch("/listings/{listing_id}")
async def update_listing(
    listing_id: str,
    payload: UpdateListingAdminRequest,
    admin=Depends(require_admin),
):
    updates = payload.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    updated = await update_listing_admin(listing_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"success": True, "data": _ser(updated)}


# ── DELETE /api/admin/listings/{listing_id} ───────────────────────────────────
@router.delete("/listings/{listing_id}")
async def delete_listing(
    listing_id: str,
    admin=Depends(require_admin),
):
    deleted = await delete_listing_admin(listing_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"success": True, "message": "Listing permanently deleted"}


# ── GET /api/admin/analytics ──────────────────────────────────────────────────
@router.get("/analytics")
async def admin_analytics(admin=Depends(require_admin)):
    top = await get_top_listings()
    categories = await get_category_breakdown()
    return {
        "success": True,
        "top_listings": [_ser(l) for l in top],
        "category_breakdown": categories,
    }

@router.post("/init")
async def init_first_admin(payload: dict):
    from app.database import get_db
    from app.core.security import hash_password
    from datetime import datetime, timezone
    import os

    db = get_db()

    # Block if admin already exists
    existing = await db.users.find_one({"role": "admin"})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin already initialized"
        )

    # Require a secret init key set in environment
    init_key = os.getenv("ADMIN_INIT_KEY")
    if not init_key or payload.get("init_key") != init_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid init key"
        )

    await db.users.insert_one({
        "full_name":         payload.get("full_name", "Admin"),
        "email":             payload["email"],
        "phone":             payload.get("phone", ""),
        "password_hash":     hash_password(payload["password"]),
        "role":              "admin",
        "subscription_tier": "premium",
        "is_suspended":      False,
        "created_at":        datetime.now(timezone.utc),
        "updated_at":        datetime.now(timezone.utc),
    })
    return {"success": True, "message": "Admin initialized"}