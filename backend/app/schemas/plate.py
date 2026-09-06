from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.rto import RTORecordOut
from app.schemas.blacklist import BlacklistOut

class PlateLog(BaseModel):
    id: int
    plate_number: str
    camera_id: str
    camera_label: str
    sector: str
    confidence: Optional[float] = None
    event_time: datetime
    is_blacklisted: bool = False

class PlateLogsResponse(BaseModel):
    items: List[PlateLog]
    total: int
    page: int
    pages: int

class PlateSearchResponse(BaseModel):
    plate_number: str
    events: List[PlateLog]
    rto: Optional[RTORecordOut] = None
    blacklist_entry: Optional[BlacklistOut] = None

class PlateIngestRequest(BaseModel):
    plate_number: str
    camera_id: str
    confidence: Optional[float] = None
    ocr_raw: Optional[str] = None
    event_time: datetime

class PlateIngestResponse(BaseModel):
    id: int
