# AI Pipeline Handoff Guide

## Integration Endpoint
The AI pipeline consumes video feeds or cropped plate images, processes them via YOLOv8 and TrOCR / PaddleOCR, and sends results to:
`POST /api/plates/ingest`

### Payload
```json
{
  "plate_number": "PB10AB1234",
  "camera_id": "CAM-07",
  "confidence": 97.4,
  "ocr_raw": "PB10AB1234",
  "event_time": "2025-06-14T14:31:09Z"
}
```

The backend verifies if the plate is on the `blacklist` and automatically triggers an alert if detected.
