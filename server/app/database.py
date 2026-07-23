import ssl
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

client: Optional[AsyncIOMotorClient] = None
db = None


def _make_ssl_context() -> ssl.SSLContext:
    """
    Build a TLS context that works on Python 3.13 + Windows + MongoDB Atlas.
    Uses certifi's CA bundle so Atlas's certificate chain validates correctly.
    """
    ctx = ssl.create_default_context(cafile=certifi.where())

    # Python 3.13 defaults to TLS 1.3 only in some builds —
    # explicitly allow 1.2 as well since Atlas uses both
    ctx.minimum_version = ssl.TLSVersion.TLSv1_2

    # Disable hostname check for the TLS handshake step
    # (Motor handles hostname verification separately)
    ctx.check_hostname = False
    ctx.verify_mode    = ssl.CERT_REQUIRED

    return ctx


async def connect_db(mongodb_uri: str, db_name: str) -> None:
    global client, db

    client = AsyncIOMotorClient(
        mongodb_uri,
        tls=True,
        tlsCAFile=certifi.where(),
        tlsAllowInvalidCertificates=False,
    )

    db = client[db_name]
    await client.admin.command("ping")
    print("✅  Connected to MongoDB Atlas")


async def close_db() -> None:
    global client
    if client:
        client.close()


def get_db():
    return db