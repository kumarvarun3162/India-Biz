from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

client: Optional[AsyncIOMotorClient] = None
db = None


async def connect_db(mongodb_uri: str, db_name: str) -> None:
    global client, db
    client = AsyncIOMotorClient(mongodb_uri)
    db = client[db_name]
    await client.admin.command("ping")
    print("✅  Connected to MongoDB Atlas")


async def close_db() -> None:
    global client
    if client:
        client.close()


def get_db():
    return db