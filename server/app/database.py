from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

# Module-level references — populated during app startup
client: Optional[AsyncIOMotorClient] = None
db = None


async def connect_db(mongodb_uri: str) -> None:
    """Open MongoDB connection. Called from FastAPI lifespan."""
    global client, db
    client = AsyncIOMotorClient(mongodb_uri)
    db = client.indiabizdb

    # Ping to confirm the connection actually works
    await client.admin.command("ping")
    print("✅  Connected to MongoDB Atlas")


async def close_db() -> None:
    """Close MongoDB connection. Called from FastAPI lifespan."""
    global client
    if client:
        client.close()
        print("MongoDB connection closed")


def get_db():
    """Dependency injector — returns the active database instance."""
    return db