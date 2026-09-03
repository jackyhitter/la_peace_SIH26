from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
from app.schemas.schemas import CameraResponse, AlertResponse, VehicleJourneyResponse, DetectionCreate
from app.websockets.connection_manager import ws_manager

api_router = APIRouter()

# Mock in-memory state for initial development & testing
MOCK_CAMERAS = [
    {"id": "CAM_01", "name": "Sector 17 North Gate", "rtsp_url": "rtsp://192.168.1.101:554/live/ch0", "status": "ONLINE", "lat": 30.7398, "lng": 76.7827, "zone": "Sector 17", "fps": 25.0, "bitrate_kbps": 4096, "last_ping": datetime.utcnow()},
    {"id": "CAM_02", "name": "Madhya Marg Junction", "rtsp_url": "rtsp://192.168.1.102:554/live/ch0", "status": "ONLINE", "lat": 30.7350, "lng": 76.7900, "zone": "Madhya Marg", "fps": 24.8, "bitrate_kbps": 4120, "last_ping": datetime.utcnow()},
    {"id": "CAM_03", "name": "Tribune Chowk Flyover", "rtsp_url": "rtsp://192.168.1.103:554/live/ch0", "status": "ONLINE", "lat": 30.7055, "lng": 76.7915, "zone": "Industrial Area", "fps": 25.0, "bitrate_kbps": 3980, "last_ping": datetime.utcnow()},
    {"id": "CAM_04", "name": "IT Park Roundabout", "rtsp_url": "rtsp://192.168.1.104:554/live/ch0", "status": "DEGRADED", "lat": 30.7240, "lng": 76.8450, "zone": "IT Park", "fps": 14.2, "bitrate_kbps": 1800, "last_ping": datetime.utcnow()}
]

MOCK_ALERTS = [
    {
        "id": "ALT_801",
        "camera_id": "CAM_02",
        "alert_type": "BLACKLIST_MATCH",
        "severity": "CRITICAL",
        "timestamp": datetime.utcnow(),
        "plate_number": "CH01AB1234",
        "details": {"reason": "Stolen vehicle FIR #4921/2026", "vehicle": "White Creta SUV"},
        "acknowledged": False
    },
    {
        "id": "ALT_802",
        "camera_id": "CAM_03",
        "alert_type": "OVERSPEEDING",
        "severity": "HIGH",
        "timestamp": datetime.utcnow(),
        "plate_number": "HR26DK9981",
        "details": {"measured_speed": 98.4, "speed_limit": 60.0, "lane": "Lane 1"},
        "acknowledged": False
    }
]

@api_router.get("/cameras", response_model=List[CameraResponse])
def get_cameras():
    return MOCK_CAMERAS

@api_router.get("/alerts", response_model=List[AlertResponse])
def get_alerts():
    return MOCK_ALERTS

@api_router.get("/journeys/{plate_number}", response_model=VehicleJourneyResponse)
def get_vehicle_journey(plate_number: str):
    return {
        "plate_number": plate_number,
        "vehicle_type": "SUV",
        "color": "white",
        "first_seen": datetime.utcnow(),
        "last_seen": datetime.utcnow(),
        "total_distance_km": 4.8,
        "waypoints": [
            {"camera_id": "CAM_01", "timestamp": datetime.utcnow(), "lat": 30.7398, "lng": 76.7827, "speed_kmh": 48.0, "snapshot_url": "/mock/crops/cam01.jpg"},
            {"camera_id": "CAM_02", "timestamp": datetime.utcnow(), "lat": 30.7350, "lng": 76.7900, "speed_kmh": 54.2, "snapshot_url": "/mock/crops/cam02.jpg"},
            {"camera_id": "CAM_03", "timestamp": datetime.utcnow(), "lat": 30.7055, "lng": 76.7915, "speed_kmh": 61.5, "snapshot_url": "/mock/crops/cam03.jpg"}
        ]
    }

@api_router.post("/events/inference")
async def post_inference_event(event: DetectionCreate):
    # Broadcast raw AI inference to connected WebSocket frontends
    await ws_manager.broadcast_json({"type": "INFERENCE_EVENT", "data": event.model_dump()})
    return {"status": "ACK", "received_at": datetime.utcnow().isoformat()}

@api_router.websocket("/ws/events")
async def websocket_event_stream(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
