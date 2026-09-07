"""
Run this from inside server/ with venv active:
python diagnose.py
"""
import sys
import os

print("\n=== INDIA BIZ LISTING — DIAGNOSTICS ===\n")

# 1. Python version
print(f"Python: {sys.version}")

# 2. Check all imports
print("\n--- Checking imports ---")
imports_ok = True

try:
    import fastapi; print(f"✅ fastapi {fastapi.__version__}")
except Exception as e:
    print(f"❌ fastapi: {e}"); imports_ok = False

try:
    import motor; print(f"✅ motor")
except Exception as e:
    print(f"❌ motor: {e}"); imports_ok = False

try:
    import pydantic; print(f"✅ pydantic {pydantic.__version__}")
except Exception as e:
    print(f"❌ pydantic: {e}"); imports_ok = False

try:
    import jwt; print(f"✅ PyJWT {jwt.__version__}")
except Exception as e:
    print(f"❌ PyJWT: {e}"); imports_ok = False

try:
    import pwdlib; print(f"✅ pwdlib")
except Exception as e:
    print(f"❌ pwdlib: {e}"); imports_ok = False

try:
    import certifi; print(f"✅ certifi {certifi.__version__}")
except Exception as e:
    print(f"❌ certifi: {e}"); imports_ok = False

try:
    import slowapi; print(f"✅ slowapi")
except Exception as e:
    print(f"❌ slowapi: {e}"); imports_ok = False

try:
    import email_validator; print(f"✅ email-validator")
except Exception as e:
    print(f"❌ email-validator: {e}"); imports_ok = False

try:
    import bson; print(f"✅ bson (pymongo)")
except Exception as e:
    print(f"❌ bson: {e}"); imports_ok = False

# 3. Check app modules load
print("\n--- Checking app modules ---")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app.config import settings
    print(f"✅ config loaded")
    print(f"   MONGODB_URI set: {'Yes' if settings.MONGODB_URI else 'NO - MISSING'}")
    print(f"   JWT_SECRET set:  {'Yes' if settings.JWT_SECRET else 'NO - MISSING'}")
    print(f"   DB_NAME:         {settings.DB_NAME}")
    print(f"   CLIENT_URL:      {settings.CLIENT_URL}")
except Exception as e:
    print(f"❌ config: {e}"); imports_ok = False

try:
    from app.schemas.user import UserCreate, UserLogin, UserPublic, Token
    print(f"✅ user schemas")
except Exception as e:
    print(f"❌ user schemas: {e}"); imports_ok = False

try:
    from app.schemas.listing import ListingCreate, ListingUpdate, ListingPublic
    print(f"✅ listing schemas")
except Exception as e:
    print(f"❌ listing schemas: {e}"); imports_ok = False

try:
    from app.core.security import hash_password, verify_password, create_access_token
    # Quick test
    h = hash_password("testpass")
    assert verify_password("testpass", h)
    token = create_access_token({"sub": "test123"})
    assert len(token) > 10
    print(f"✅ security (hash + JWT)")
except Exception as e:
    print(f"❌ security: {e}"); imports_ok = False

try:
    from app.utils.slugify import slugify
    s = slugify("Test Business Name")
    assert "-" in s
    print(f"✅ slugify → '{s}'")
except Exception as e:
    print(f"❌ slugify: {e}"); imports_ok = False

try:
    from app.utils.category_templates import CATEGORIES, CATEGORY_MAP
    assert len(CATEGORIES) == 10
    print(f"✅ category templates ({len(CATEGORIES)} categories)")
except Exception as e:
    print(f"❌ category templates: {e}"); imports_ok = False

try:
    from app.middleware.error_handler import (
        http_exception_handler,
        validation_exception_handler,
        general_exception_handler
    )
    print(f"✅ error handlers")
except Exception as e:
    print(f"❌ error handlers: {e}"); imports_ok = False

try:
    from app.routers.auth import router as auth_router
    print(f"✅ auth router")
except Exception as e:
    print(f"❌ auth router: {e}"); imports_ok = False

try:
    from app.routers.listings import router as listings_router
    print(f"✅ listings router")
except Exception as e:
    print(f"❌ listings router: {e}"); imports_ok = False

# 4. Test MongoDB connection
print("\n--- Testing MongoDB connection ---")
import asyncio, certifi

async def test_mongo():
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        from app.config import settings
        client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=10000
        )
        await client.admin.command("ping")
        db = client[settings.DB_NAME]
        # Check collections
        collections = await db.list_collection_names()
        print(f"✅ MongoDB connected — DB: {settings.DB_NAME}")
        print(f"   Collections: {collections if collections else '(empty — first run)'}")
        client.close()
        return True
    except Exception as e:
        print(f"❌ MongoDB: {e}")
        return False

mongo_ok = asyncio.run(test_mongo())

# 5. Summary
print("\n=== RESULT ===")
if imports_ok and mongo_ok:
    print("✅ All checks passed — server should start cleanly")
else:
    print("❌ Fixes needed — see errors above before starting uvicorn")
print()