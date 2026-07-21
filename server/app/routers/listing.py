from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.dependencies.auth import get_current_user
from app.utils.category_templates import CATEGORIES

router = APIRouter(prefix="/api/listings", tags=["listings"])


# ── GET /api/listings/categories ─────────────────────────────────────────────
@router.get("/categories")
async def get_categories():
    """
    Returns all supported business categories with their templates.
    Used by the frontend to populate the category selector and
    auto-fill the form when a category is chosen.
    """
    return {
        "success": True,
        "categories": CATEGORIES,
    }