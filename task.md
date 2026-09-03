# SIH 2026 — CCTV -> ANPR -> Vehicle Intelligence Platform

## Project Overview
A city-wide multi-camera vehicle tracking, ANPR, and traffic intelligence system.
Designed to be modular, developer-first, and raw-data oriented.

---

## 13-Phase Execution Roadmap

- [x] **Phase 0: Repository & Tooling Setup**
  - Git, folder structure, `.gitignore`, `task.md` (keeping `README.md` untouched).
- [ ] **Phase 1: Architecture & API Contracts**
  - Canonical JSON schemas for AI -> Backend and Backend -> Frontend (`contracts/`).
- [ ] **Phase 2: Database & Backend Skeleton**
  - PostGIS models, FastAPI shell, mock data generator (`backend/`).
- [ ] **Phase 3: Frontend Skeleton (React)**
  - Raw black & white developer-first UI, wireframe video boxes, raw event dumps, route tabs (`frontend/`).
- [ ] **Phase 4: AI Baseline**
  - YOLO detection + ByteTrack tracking + PaddleOCR pipeline stubs (`ai_engine/`).
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

## Architecture Layout

```text
la_peace_SIH26/
├── contracts/                  # Canonical JSON Schemas & Event Specs
│   ├── ai_to_backend.json      # VehicleDetectionEvent, PlateOcrEvent
│   ├── backend_to_frontend.json# REST & WS response payloads
│   └── kafka_topics.json       # Event topics definition
├── ai_engine/                  # Ingestion & Inference Workers (YOLO, ByteTrack, OCR)
│   ├── configs/
│   ├── models/
│   ├── pipelines/
│   └── main_worker.py
├── backend/                    # FastAPI & PostGIS Engine
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── websockets/
│   ├── scripts/
│   ├── requirements.txt
│   └── main.py
├── frontend/                   # Raw React App (B&W, simple wireframes, raw dumps)
│   ├── src/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docker/                     # Docker Compose & Container configs
│   └── docker-compose.yml
├── .gitignore
├── README.md                   # Existing project README (UNTOUCHED)
└── task.md                     # Phase roadmap & task tracker
```
