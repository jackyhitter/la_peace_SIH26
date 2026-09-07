# SIH 2026: Real-Time ANPR & Vehicle Analytics Platform

An integrated end-to-end Automatic Number Plate Recognition (ANPR) and real-time vehicle analytics system built for the Smart India Hackathon (SIH) 2026. 

This platform leverages high-performance computer vision pipelines coupled with a real-time reactive web dashboard to track, identify, and log vehicle metadata from live video streams.

## System Architecture

The repository is modularized into three distinct micro-services:

- **`frontend/`** (React + Vite + TailwindCSS)
  A low-latency, cyber-monochrome monitoring dashboard that consumes HTTP REST endpoints for state and WebSockets for real-time AI telemetry.
- **`backend/`** (FastAPI + SQLite + WebSockets)
  The core API gateway and database manager. It handles authentication, data persistence, event broadcasting, and serves as the bridge between the AI engine and the dashboard.
- **`ai/`** (YOLOv8 + EasyOCR + Flask + OpenCV)
  The heavy-lifting ML pipeline. Processes raw video frames, runs object detection (vehicles), tripwire logic, speed estimation, and plate OCR. Streams MJPEG video back to the frontend and fires JSON telemetry events to the backend.

## Prerequisites

- **Node.js** (v18+)
- **Python** (3.10 recommended for ML dependency compatibility)
- **Conda** (Miniconda/Anaconda for environment management)

## Running the Application

To run the complete system locally, you must spawn three isolated processes. Open three separate terminal sessions at the repository root.

### 1. Database & API Server (Backend)
Initializes the SQLite database and binds the REST/WebSocket API to port `8000`.

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Client Dashboard (Frontend)
Builds and serves the React frontend on port `5173`. Default credentials for the dashboard are `admin` / `admin123`.

```bash
cd frontend
npm install
npm run dev
```

### 3. ML Inference Engine (AI)
Configures a dedicated Conda environment to resolve complex C++ binary dependencies (OpenCV, PyTorch) and begins inference on the sample video feed. Streams MJPEG to port `5000` and dispatches WebSocket events to port `8000`.

```bash
cd ai
conda create -n ai_env python=3.10 -y
conda activate ai_env
pip install -r requirements.txt
python run_video_feed.py --source data/video_testing.mp4
```

## Default Credentials
- **Username:** `admin`
- **Password:** `admin123`

## Licensing
This project was developed for SIH 2026. All rights reserved by the respective authors.
