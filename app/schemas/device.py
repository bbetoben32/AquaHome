from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DeviceCreate(BaseModel):
    name: str
    location: Optional[str] = None
    device_type: Optional[str] = None
    description: Optional[str] = None  # ← NUEVO

class DeviceResponse(BaseModel):
    id: int
    name: str
    location: Optional[str]
    device_type: Optional[str]
    description: Optional[str]  # ← NUEVO
    is_active: bool
    created_at: datetime
    last_seen:  Optional[datetime]
    owner_id: int

    class Config:
        from_attributes = True