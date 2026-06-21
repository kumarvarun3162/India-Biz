from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.database import connect_db, close_db
import os
from dotenv import load_dotenv

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_db(os.getenv("MONGODB_URI"))
    yield
    # Shutdown
    await close_db()


app = FastAPI(
    title="India Biz Listing API",
    description="Backend for India Biz Listing platform",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/")
async def root():
    return {"message": "India Biz Listing API is running", "status": "ok"}


@app.get("/health")
async def health():
    return {"status": "healthy"}