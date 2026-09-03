from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class CameraBase(BaseModel):
    id: str
    name: str
    rtsp_url: str
    status: str = "ONLINE"
    lat: float
    lng: float
    zone: str = "Sector 17"
    fps: float = 25.0
    bitrate_kbps: int = 4096

class CameraResponse(CameraBase):
    last_ping: Optional[datetime] = None
    class Config:
        from_attributes = True

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

class AlertResponse(BaseModel):
    id: str
    camera_id: str
    alert_type: str
    severity: str
    timestamp: datetime
    plate_number: Optional[str] = None
    details: Dict[str, Any] = {}
    acknowledged: bool = False

class Waypoint(BaseModel):
    camera_id: str
    timestamp: datetime
    lat: float
    lng: float
    speed_kmh: float
    snapshot_url: Optional[str] = None

class VehicleJourneyResponse(BaseModel):
    plate_number: str
    vehicle_type: Optional[str] = "car"
    color: Optional[str] = "white"
    first_seen: datetime
    last_seen: datetime
    total_distance_km: float = 0.0
    waypoints: List[Waypoint] = []
