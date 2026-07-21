from datetime import datetime, timezone
from bson import ObjectId
from app.database import get_db
from app.utils.slugify import slugify


# ── helpers ───────────────────────────────────────────────────────────────────
def _now():
    return datetime.now(timezone.utc)


def _oid(id_str: str):
    return ObjectId(id_str) if ObjectId.is_valid(id_str) else None


# ── create ────────────────────────────────────────────────────────────────────
async def create_listing(user_id: str, data: dict) -> dict:
    db = get_db()
    now = _now()
    doc = {
        **data,
        "user_id":    ObjectId(user_id),
        "slug":       slugify(data["business_name"]),
        "images":     [],
        "is_active":  True,
        "is_featured": False,
        "views_total": 0,
        "created_at": now,
        "updated_at": now,
    }
    result = await db.listings.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc


# ── read ──────────────────────────────────────────────────────────────────────
async def get_listing_by_slug(slug: str) -> dict | None:
    db = get_db()
    return await db.listings.find_one({"slug": slug, "is_active": True})


async def get_listing_by_id(listing_id: str) -> dict | None:
    db = get_db()
    oid = _oid(listing_id)
    if not oid:
        return None
    return await db.listings.find_one({"_id": oid})


async def get_listings_by_user(user_id: str) -> list[dict]:
    db = get_db()
    cursor = db.listings.find(
        {"user_id": ObjectId(user_id)}
    ).sort("created_at", -1)
    return await cursor.to_list(length=100)


async def search_listings(
    city: str | None,
    category: str | None,
    search: str | None,
    page: int,
    limit: int,
) -> tuple[list[dict], int]:
    """Returns (listings, total_count) for the given filters."""
    db = get_db()

    query: dict = {"is_active": True}
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if category:
        query["category"] = category
    if search:
        query["$text"] = {"$search": search}

    total   = await db.listings.count_documents(query)
    skip    = (page - 1) * limit
    cursor  = db.listings.find(query).sort("is_featured", -1).skip(skip).limit(limit)
    results = await cursor.to_list(length=limit)
    return results, total


# ── update ────────────────────────────────────────────────────────────────────
async def update_listing(listing_id: str, updates: dict) -> dict | None:
    db = get_db()
    oid = _oid(listing_id)
    if not oid:
        return None

    updates["updated_at"] = _now()
    await db.listings.update_one({"_id": oid}, {"$set": updates})
    return await db.listings.find_one({"_id": oid})


async def increment_views(listing_id) -> None:
    """Atomically add 1 to views_total — safe under concurrent traffic."""
    db = get_db()
    await db.listings.update_one(
        {"_id": listing_id},
        {"$inc": {"views_total": 1}}
    )


# ── delete ────────────────────────────────────────────────────────────────────
async def delete_listing(listing_id: str) -> bool:
    db = get_db()
    oid = _oid(listing_id)
    if not oid:
        return False
    result = await db.listings.delete_one({"_id": oid})
    return result.deleted_count == 1