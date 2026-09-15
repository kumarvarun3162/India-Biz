"""
Run once to create your admin account:
python seed_admin.py
"""
import asyncio
import certifi
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

from app.config import settings
from app.core.security import hash_password


async def seed_admin():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(
        settings.MONGODB_URI,
        tlsCAFile=certifi.where()
    )
    db = client[settings.DB_NAME]

    # Check if admin already exists
    existing = await db.users.find_one({"role": "admin"})
    if existing:
        print(f"Admin already exists: {existing['email']}")
        client.close()
        return

    # ── Change these values before running ────────────────────────
    ADMIN_EMAIL    = "admin@indiabizlisting.com"
    ADMIN_PASSWORD = "Admin@IBL2026"          # change this
    ADMIN_NAME     = "Varun — Admin"
    ADMIN_PHONE    = "7206763162"
    # ──────────────────────────────────────────────────────────────

    admin_doc = {
        "full_name":         ADMIN_NAME,
        "email":             ADMIN_EMAIL,
        "phone":             ADMIN_PHONE,
        "password_hash":     hash_password(ADMIN_PASSWORD),
        "role":              "admin",
        "subscription_tier": "premium",
        "is_suspended":      False,
        "created_at":        datetime.now(timezone.utc),
        "updated_at":        datetime.now(timezone.utc),
    }

    await db.users.insert_one(admin_doc)
    print(f"✅ Admin created successfully")
    print(f"   Email:    {ADMIN_EMAIL}")
    print(f"   Password: {ADMIN_PASSWORD}")
    print(f"   ⚠️  Save these credentials somewhere safe!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_admin())