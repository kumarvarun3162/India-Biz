from datetime import datetime
from typing import Annotated, Optional
from pydantic import BaseModel, Field, BeforeValidator

PyObjectId = Annotated[str, BeforeValidator(str)]


# ── Hours shape ───────────────────────────────────────────────────────────────
class DayHours(BaseModel):
    open:   str = "09:00"
    close:  str = "18:00"
    closed: bool = False


class BusinessHours(BaseModel):
    mon: DayHours = DayHours()
    tue: DayHours = DayHours()
    wed: DayHours = DayHours()
    thu: DayHours = DayHours()
    fri: DayHours = DayHours()
    sat: DayHours = DayHours()
    sun: DayHours = Field(default_factory=lambda: DayHours(closed=True))


# ── Request bodies ────────────────────────────────────────────────────────────
class ListingCreate(BaseModel):
    business_name: str        = Field(..., min_length=2, max_length=120)
    category:      str        = Field(..., min_length=2)
    description:   str        = Field(..., min_length=10, max_length=1000)
    address:       str        = Field(..., min_length=5)
    city:          str        = Field(..., min_length=2)
    state:         str        = Field(..., min_length=2)
    pincode:       str        = Field(..., pattern=r"^\d{6}$")
    phone:         str        = Field(..., pattern=r"^[6-9]\d{9}$")
    whatsapp:      Optional[str] = None
    email:         Optional[str] = None
    website:       Optional[str] = None
    hours:         BusinessHours = Field(default_factory=BusinessHours)


class ListingUpdate(BaseModel):
    """All fields optional — only update what was sent"""
    business_name: Optional[str]          = None
    category:      Optional[str]          = None
    description:   Optional[str]          = None
    address:       Optional[str]          = None
    city:          Optional[str]          = None
    state:         Optional[str]          = None
    pincode:       Optional[str]          = None
    phone:         Optional[str]          = None
    whatsapp:      Optional[str]          = None
    email:         Optional[str]          = None
    website:       Optional[str]          = None
    hours:         Optional[BusinessHours] = None
    is_active:     Optional[bool]          = None


# ── Response bodies ───────────────────────────────────────────────────────────
class ListingPublic(BaseModel):
    """Returned to anyone — public listing page"""
    id:            PyObjectId   = Field(alias="_id")
    slug:          str
    business_name: str
    category:      str
    description:   str
    address:       str
    city:          str
    state:         str
    pincode:       str
    phone:         str
    whatsapp:      Optional[str] = None
    email:         Optional[str] = None
    website:       Optional[str] = None
    hours:         BusinessHours
    images:        list[str]    = []
    is_featured:   bool         = False
    views_total:   int          = 0
    created_at:    datetime

    class Config:
        populate_by_name = True


class ListingInDB(ListingPublic):
    """Returned to the owner — includes private fields"""
    user_id:   PyObjectId = Field(alias="user_id")
    is_active: bool       = True
    updated_at: datetime