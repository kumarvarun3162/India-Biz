from datetime import datetime, timezone
from bson import ObjectId
from app.database import get_db


async def get_user_by_email(email: str) -> dict | None:
    db = get_db()
    return await db.users.find_one({"email": email})


async def get_user_by_id(user_id: str) -> dict | None:
    db = get_db()
    if not ObjectId.is_valid(user_id):
        return None
    return await db.users.find_one({"_id": ObjectId(user_id)})


async def create_user(full_name: str, email: str, phone: str, password_hash: str) -> dict:
    db = get_db()
    now = datetime.now(timezone.utc)
    user_doc = {
        "full_name": full_name,
        "email": email,
        "phone": phone,
        "password_hash": password_hash,
        "role": "user",
        "subscription_tier": "free",
        "subscription_expires": None,
        "created_at": now,
        "updated_at": now,
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return user_doc

async def update_user_profile(user_id: str, updates: dict) -> dict | None:
    db  = get_db()
    oid = ObjectId(user_id)
    updates["updated_at"] = datetime.now(timezone.utc)
    await db.users.update_one({"_id": oid}, {"$set": updates})
    return await db.users.find_one({"_id": oid}, {"password_hash": 0})