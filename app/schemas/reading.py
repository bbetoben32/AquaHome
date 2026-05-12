from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ReadingCreate(BaseModel):
    ph: Optional[float] = None
    temperature: Optional[float] = None
    turbidity: Optional[float] = None
    tds: Optional[float] = None
    device_id: int

class ReadingResponse(BaseModel):
    id: int
    ph: Optional[float]
    temperature: Optional[float]
    turbidity: Optional[float]
    tds: Optional[float]
    timestamp: datetime
    device_id: int

    class Config:
        from_attributes = True