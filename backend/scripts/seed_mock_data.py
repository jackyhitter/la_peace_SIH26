"""
Database & Event Seeding Script
Simulates synthetic camera network, detections, and alerts for local testing.
"""
import json
import time
from datetime import datetime

def generate_sample_events():
    events = [
        {
            "event_id": "EVT_001",
            "camera_id": "CAM_01",
            "timestamp": datetime.utcnow().isoformat(),
            "frame_id": 1402,
            "detections": [
                {
                    "track_id": 182,
                    "vehicle_class": "car",
                    "bbox": {"x_min": 0.22, "y_min": 0.45, "x_max": 0.48, "y_max": 0.78},
                    "confidence": 0.94,
                    "speed_kmh": 52.4,
                    "plate": {
                        "plate_number": "CH01AB1234",
                        "ocr_confidence": 0.98,
                        "state_code": "CH"
                    }
                }
            ]
        }
    ]
    print("Generated sample event batch:")
    print(json.dumps(events, indent=2))

if __name__ == "__main__":
    generate_sample_events()
