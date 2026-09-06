from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BlacklistCreate(BaseModel):
    plate_number: str
    reason: str

class BlacklistOut(BaseModel):
    id: int
    plate_number: str
    reason: str
    added_by_name: Optional[str] = None
    added_at: datetime
    is_active: Optional[bool] = True

    class Config:
        from_attributes = True

class BlacklistDeleteResponse(BaseModel):
    detail: str = "Removed from restricted list"
