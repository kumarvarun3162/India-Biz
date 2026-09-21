from datetime import datetime, timezone
from bson import ObjectId
from app.database import get_db


def _today() -> str:
    """Return today's date as YYYY-MM-DD string (UTC)."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def _now():
    return datetime.now(timezone.utc)


async def track_view(listing_id) -> None:
    """
    Atomically increment view count for today.
    Creates the daily record if it doesn't exist yet.
    Called on every GET /api/listings/:slug hit.
    """
    db    = get_db()
    today = _today()

    await db.analytics.update_one(
        {
            "listing_id": listing_id,
            "date":       today,
        },
        {
            "$inc":      {"views": 1},
            "$setOnInsert": {
                "listing_id":      listing_id,
                "date":            today,
                "whatsapp_clicks": 0,
                "phone_clicks":    0,
                "created_at":      _now(),
            },
            "$set": {"updated_at": _now()},
        },
        upsert=True,
    )


async def track_event(listing_id: str, event_type: str) -> None:
    """
    Increment whatsapp_clicks or phone_clicks for today.
    event_type: "whatsapp" | "phone"
    """
    db    = get_db()
    today = _today()
    field = "whatsapp_clicks" if event_type == "whatsapp" else "phone_clicks"

    await db.analytics.update_one(
        {
            "listing_id": ObjectId(listing_id),
            "date":       today,
        },
        {
            "$inc": {field: 1},
            "$setOnInsert": {
                "listing_id": ObjectId(listing_id),
                "date":       today,
                "views":      0,
                "whatsapp_clicks": 0,
                "phone_clicks":    0,
                "created_at": _now(),
            },
            "$set": {"updated_at": _now()},
        },
        upsert=True,
    )


async def get_analytics(
    listing_id: str,
    days:       int = 30,
) -> dict:
    """
    Return analytics data for the last N days.
    Includes daily breakdown + aggregated totals.
    """
    db = get_db()
    oid = ObjectId(listing_id)

    # Get all daily records for this listing sorted by date
    cursor = db.analytics.find(
        {"listing_id": oid}
    ).sort("date", -1).limit(days)
    records = await cursor.to_list(length=days)

    # Reverse so oldest is first (for charts)
    records.reverse()

    # Aggregate totals
    total_views     = sum(r.get("views", 0)            for r in records)
    total_whatsapp  = sum(r.get("whatsapp_clicks", 0)  for r in records)
    total_phone     = sum(r.get("phone_clicks", 0)     for r in records)

    # Best day
    best = max(records, key=lambda r: r.get("views", 0)) if records else None

    # Daily data for chart
    daily = [
        {
            "date":             r["date"],
            "views":            r.get("views", 0),
            "whatsapp_clicks":  r.get("whatsapp_clicks", 0),
            "phone_clicks":     r.get("phone_clicks", 0),
        }
        for r in records
    ]

    return {
        "daily":          daily,
        "total_views":    total_views,
        "total_whatsapp": total_whatsapp,
        "total_phone":    total_phone,
        "best_day":       best["date"] if best else None,
        "best_day_views": best.get("views", 0) if best else 0,
        "days_tracked":   len(records),
    }