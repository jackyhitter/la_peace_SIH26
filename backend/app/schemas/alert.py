from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AlertOut(BaseModel):
    id: int
    type: str
    severity: str
    camera_id: Optional[str] = None
    camera_label: Optional[str] = None
    plate_number: Optional[str] = None
    description: Optional[str] = None
    status: str
    created_at: datetime
    resolved_at: Optional[datetime] = None
    resolved_by: Optional[int] = None

    class Config:
        from_attributes = True

class AlertListResponse(BaseModel):
    items: List[AlertOut]
    total: int
