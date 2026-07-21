import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

client: Optional[AsyncIOMotorClient] = None
db = None


async def connect_db(mongodb_uri: str, db_name: str) -> None:
    global client, db
    client = AsyncIOMotorClient(mongodb_uri, tlsCAFile=certifi.where())
    db = client[db_name]
    await client.admin.command("ping")

    # Indexes
    await db.users.create_index("email", unique=True)
    await db.listings.create_index(
        [("business_name", "text"), ("description", "text")],
        name="listings_text_search"
    )
    await db.listings.create_index("slug", unique=True)
    await db.listings.create_index("user_id")

    print("✅  Connected to MongoDB Atlas")

async def close_db() -> None:
    global client
    if client:
        client.close()


def get_db():
    return db