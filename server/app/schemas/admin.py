from datetime import datetime
from typing import Optional, Annotated
from pydantic import BaseModel, BeforeValidator

PyObjectId = Annotated[str, BeforeValidator(str)]


class UserAdminView(BaseModel):
    """User as seen by admin — includes all fields"""
    id:                PyObjectId  = None
    full_name:         str
    email:             Optional[str] = None
    phone:             Optional[str] = None
    role:              str          = "user"
    subscription_tier: str          = "free"
    is_suspended:      bool         = False
    created_at:        datetime

    class Config:
        populate_by_name = True


class ListingAdminView(BaseModel):
    """Listing as seen by admin"""
    id:            PyObjectId = None
    business_name: str
    category:      str
    city:          str
    state:         str
    phone:         str
    is_active:     bool
    is_featured:   bool       = False
    views_total:   int        = 0
    created_at:    datetime
    owner_name:    Optional[str] = None
    owner_email:   Optional[str] = None

    class Config:
        populate_by_name = True


class PlatformStats(BaseModel):
    """Overview numbers for admin dashboard"""
    total_users:          int
    total_listings:       int
    active_listings:      int
    inactive_listings:    int
    featured_listings:    int
    new_users_this_week:  int
    new_listings_this_week: int
    total_views_all_time: int


class SuspendUserRequest(BaseModel):
    is_suspended: bool


class UpdateListingAdminRequest(BaseModel):
    is_active:   Optional[bool] = None
    is_featured: Optional[bool] = None