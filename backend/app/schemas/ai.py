from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict

class DetectionCreate(BaseModel):
    camera_id: str
    track_id: int
    timestamp: datetime = datetime.utcnow()
    vehicle_class: str
    bbox: Dict[str, float]
    confidence: float
    speed_kmh: float = 0.0
    direction_deg: float = 0.0
    color: Optional[str] = None
    make: Optional[str] = None
    plate_number: Optional[str] = None
    plate_confidence: Optional[float] = None
    plate_crop_url: Optional[str] = None
