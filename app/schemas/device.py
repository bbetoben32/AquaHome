from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DeviceCreate(BaseModel):
    name: str
    location: Optional[str] = None
    device_type: Optional[str] = None  # ← NUEVO: "alberca" o "tanque_elevado"

class DeviceResponse(BaseModel):
    id: int
    name: str
    location: Optional[str]
    device_type: Optional[str]  # ← NUEVO
    is_active: bool
    created_at: datetime
    last_seen:  Optional[datetime]
    owner_id: int

    class Config:
        from_attributes = True