from fastapi import FastAPI

app = FastAPI(
    title="India Biz Listing API",
    description="Backend for India Biz Listing platform",
    version="1.0.0",
)

@app.get("/")
async def root():
    return {"message": "India Biz Listing API is running", "status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}