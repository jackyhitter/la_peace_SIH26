# SIH 2026 — CCTV -> ANPR -> Vehicle Intelligence Platform

## Project Overview
A city-wide multi-camera vehicle tracking, ANPR, and traffic intelligence system.
Designed to be modular, developer-first, and raw-data oriented.

---

## 13-Phase Execution Roadmap

- [x] **Phase 0: Repository & Tooling Setup**
  - Git, folder structure, `.gitignore`, `task.md` (keeping `README.md` untouched).
- [x] **Phase 1: Architecture & API Contracts**
  - Canonical JSON schemas for AI -> Backend and Backend -> Frontend (`contracts/`).
- [x] **Phase 2: Database & Backend Skeleton**
  - PostGIS models, FastAPI shell, mock data generator (`backend/`).
- [x] **Phase 3: Frontend Skeleton (React)**
  - Raw black & white developer-first UI, wireframe video boxes, raw event dumps, route tabs (`frontend/`).
- [x] **Phase 4: AI Baseline & Modular Analytics**
  - YOLOv8 detection + ByteTrack persistent tracking + Plate Cropping + Speed Estimation + Virtual Lines (`ai_engine/`).
- [ ] **Phase 5: Mock Integration**
  - Frontend rendering mock trajectories and alerts from backend/contracts.
- [ ] **Phase 6: AI → Backend Integration**
  - AI posting real/simulated inference events to the database and event bus.
- [ ] **Phase 7: Vehicle Trajectory & GIS**
  - Connecting camera detections chronologically into vehicle journeys on the map.
- [ ] **Phase 8: Traffic Analytics**
  - Density calculations, vehicle-type distribution, and flow counters.
- [ ] **Phase 9: Alerts & Anomaly Detection**
  - Blacklist match, speed anomaly, red-light, and helmet violation logic.
- [ ] **Phase 10: Realtime WebSockets**
  - Live alert and telemetry streaming directly to the raw UI.
- [ ] **Phase 11: End-to-End Integration Testing & Tuning**
  - Multi-frame OCR voting and confidence thresholds.
- [ ] **Phase 12: Docker Deployment & SIH Demo Preparation**
  - Multi-container setup with `docker-compose.yml` (PostGIS, Kafka, FastAPI, React).

---

## Modular AI Engine Architecture (`ai_engine/`)

```text
ai_engine/
├── configs/
│   └── pipeline_config.json        # YOLO, ByteTrack, OCR thresholds
├── data/
│   ├── README.md                   # Video placement guide
│   └── video_testing.mp4           # Active test feed
├── modules/                        # Scalable Analytics Modules
│   ├── anpr/
│   │   ├── __init__.py
│   │   ├── plate_cropper.py        # Vehicle & plate candidate extraction + CLAHE
│   │   └── plate_ocr.py            # Indian license plate normalization & regex
│   ├── speed/
│   │   ├── __init__.py
│   │   └── speed_estimator.py      # Pixel-to-meter displacement & EMA smoothing
│   └── zones/
│       ├── __init__.py
│       └── line_cross_detector.py  # Virtual tripwires, in/out count, wrong-way detection
├── emitters/
│   ├── __init__.py
│   └── http_emitter.py             # Asynchronous JSON event dispatcher to FastAPI
├── run_video_feed.py               # Integrated multi-module pipeline runner
└── requirements.txt                # Ultralytics, OpenCV, EasyOCR, Requests
```
