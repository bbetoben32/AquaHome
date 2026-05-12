from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DeviceCreate(BaseModel):
    name: str
    location: Optional[str] = None

class DeviceResponse(BaseModel):
    id: int
    name: str
    location: Optional[str]
    is_active: bool
    created_at: datetime
    last_seen:  Optional[datetime]
    owner_id: int

    class Config:
        from_attributes = True