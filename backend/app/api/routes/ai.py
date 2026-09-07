from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.schemas.ai import DetectionCreate
from app.websockets.connection_manager import ws_manager
import logging

logger = logging.getLogger("cityapr")

router = APIRouter(tags=["ai"])

@router.post("/events/inference")
async def post_inference_event(event: DetectionCreate):
    # Broadcast raw AI inference to connected WebSocket frontends
    await ws_manager.broadcast_json({"type": "INFERENCE_EVENT", "data": event.model_dump(mode='json')})
    return {"status": "ACK", "received_at": datetime.utcnow().isoformat()}

@router.websocket("/ws/events")
async def websocket_event_stream(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
