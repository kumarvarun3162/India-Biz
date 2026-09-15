from datetime import datetime, timezone, timedelta
from bson import ObjectId
from app.database import get_db


def _now():
    return datetime.now(timezone.utc)


# ── Platform stats ─────────────────────────────────────────────────────────────
async def get_platform_stats() -> dict:
    db = get_db()
    week_ago = _now() - timedelta(days=7)

    total_users     = await db.users.count_documents({"role": {"$ne": "admin"}})
    total_listings  = await db.listings.count_documents({})
    active_listings = await db.listings.count_documents({"is_active": True})
    inactive        = await db.listings.count_documents({"is_active": False})
    featured        = await db.listings.count_documents({"is_featured": True})
    new_users       = await db.users.count_documents({
        "role": {"$ne": "admin"},
        "created_at": {"$gte": week_ago}
    })
    new_listings    = await db.listings.count_documents({
        "created_at": {"$gte": week_ago}
    })

    # Sum all views across all listings
    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$views_total"}}}]
    result = await db.listings.aggregate(pipeline).to_list(1)
    total_views = result[0]["total"] if result else 0

    return {
        "total_users":             total_users,
        "total_listings":          total_listings,
        "active_listings":         active_listings,
        "inactive_listings":       inactive,
        "featured_listings":       featured,
        "new_users_this_week":     new_users,
        "new_listings_this_week":  new_listings,
        "total_views_all_time":    total_views,
    }


# ── Growth chart data (last 30 days) ──────────────────────────────────────────
async def get_growth_data() -> list:
    db  = get_db()
    now = _now()
    data = []
    for i in range(29, -1, -1):
        day_start = (now - timedelta(days=i)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        day_end = day_start + timedelta(days=1)
        users    = await db.users.count_documents({
            "created_at": {"$gte": day_start, "$lt": day_end}
        })
        listings = await db.listings.count_documents({
            "created_at": {"$gte": day_start, "$lt": day_end}
        })
        data.append({
            "date":     day_start.strftime("%d %b"),
            "users":    users,
            "listings": listings,
        })
    return data


# ── Recent signups (last 5 users) ─────────────────────────────────────────────
async def get_recent_signups(limit: int = 8) -> list:
    db = get_db()
    cursor = db.users.find(
        {"role": {"$ne": "admin"}},
        {"password_hash": 0}
    ).sort("created_at", -1).limit(limit)
    return await cursor.to_list(length=limit)


# ── Users ──────────────────────────────────────────────────────────────────────
async def get_all_users(
    search: str | None = None,
    page:   int = 1,
    limit:  int = 20,
) -> tuple[list, int]:
    db    = get_db()
    query = {"role": {"$ne": "admin"}}

    if search:
        query["$or"] = [
            {"full_name": {"$regex": search, "$options": "i"}},
            {"email":     {"$regex": search, "$options": "i"}},
            {"phone":     {"$regex": search, "$options": "i"}},
        ]

    total  = await db.users.count_documents(query)
    skip   = (page - 1) * limit
    cursor = db.users.find(query, {"password_hash": 0}).sort(
        "created_at", -1
    ).skip(skip).limit(limit)
    users  = await cursor.to_list(length=limit)
    return users, total


async def set_user_suspended(user_id: str, suspended: bool) -> dict | None:
    db  = get_db()
    oid = ObjectId(user_id)
    await db.users.update_one(
        {"_id": oid},
        {"$set": {"is_suspended": suspended, "updated_at": _now()}}
    )
    return await db.users.find_one({"_id": oid}, {"password_hash": 0})


# ── Listings ──────────────────────────────────────────────────────────────────
async def get_all_listings_admin(
    search:   str | None = None,
    category: str | None = None,
    page:     int = 1,
    limit:    int = 20,
) -> tuple[list, int]:
    db    = get_db()
    query = {}
    if search:
        query["$or"] = [
            {"business_name": {"$regex": search, "$options": "i"}},
            {"city":          {"$regex": search, "$options": "i"}},
        ]
    if category:
        query["category"] = category

    total  = await db.listings.count_documents(query)
    skip   = (page - 1) * limit
    cursor = db.listings.find(query).sort("created_at", -1).skip(skip).limit(limit)
    listings = await cursor.to_list(length=limit)

    # Attach owner info
    for listing in listings:
        owner = await db.users.find_one(
            {"_id": listing["user_id"]},
            {"full_name": 1, "email": 1, "phone": 1}
        )
        listing["owner_name"]  = owner.get("full_name", "Unknown") if owner else "Deleted"
        listing["owner_email"] = owner.get("email", owner.get("phone", "")) if owner else ""

    return listings, total


async def update_listing_admin(listing_id: str, updates: dict) -> dict | None:
    db  = get_db()
    oid = ObjectId(listing_id)
    updates["updated_at"] = _now()
    await db.listings.update_one({"_id": oid}, {"$set": updates})
    return await db.listings.find_one({"_id": oid})


async def delete_listing_admin(listing_id: str) -> bool:
    db     = get_db()
    oid    = ObjectId(listing_id)
    result = await db.listings.delete_one({"_id": oid})
    return result.deleted_count == 1


# ── Top listings by views ─────────────────────────────────────────────────────
async def get_top_listings(limit: int = 10) -> list:
    db     = get_db()
    cursor = db.listings.find(
        {"is_active": True}
    ).sort("views_total", -1).limit(limit)
    return await cursor.to_list(length=limit)


# ── Category breakdown ────────────────────────────────────────────────────────
async def get_category_breakdown() -> list:
    db       = get_db()
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    return await db.listings.aggregate(pipeline).to_list(20)