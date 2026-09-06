from pydantic import BaseModel
from typing import Optional
from datetime import date

class CameraOut(BaseModel):
    id: str
    label: str
    sector: str
    latitude: float
    longitude: float
    status: str
    installed_at: Optional[date] = None

    class Config:
        from_attributes = True

class CameraSummaryOut(BaseModel):
    total: int
    active: int
    fault: int
    offline: int
