from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.crud.analytics import track_event, get_analytics
from app.dependencies.auth import get_current_user
from app.crud.listing import get_listing_by_id
from fastapi import Depends

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


class EventPayload(BaseModel):
    listing_id: str
    event_type: str   # "whatsapp" | "phone"


@router.post("/event", status_code=status.HTTP_200_OK)
async def record_event(payload: EventPayload):
    """
    Track a click event from the public listing page.
    No auth required — anyone viewing can trigger this.
    """
    if payload.event_type not in ("whatsapp", "phone"):
        raise HTTPException(
            status_code=400,
            detail="event_type must be 'whatsapp' or 'phone'"
        )
    try:
        await track_event(payload.listing_id, payload.event_type)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))