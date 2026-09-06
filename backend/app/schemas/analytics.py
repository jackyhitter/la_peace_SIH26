from pydantic import BaseModel
from typing import List, Optional

class TrafficBucket(BaseModel):
    time: str
    vehicle_count: int
    plate_reads: int

class TrafficResponse(BaseModel):
    buckets: List[TrafficBucket]

class AnalyticsSummaryOut(BaseModel):
    vehicles_today: int
    plate_reads_today: int
    ocr_accuracy: float
    active_cameras: int
    fault_cameras: int
    alerts_today: int

class CameraRankingItem(BaseModel):
    camera_id: str
    camera_label: str
    sector: str
    read_count: int
    status: str

class CameraRankingResponse(BaseModel):
    cameras: List[CameraRankingItem]

class HeatmapPoint(BaseModel):
    camera_id: str
    latitude: float
    longitude: float
    weight: float

class HeatmapResponse(BaseModel):
    points: List[HeatmapPoint]
