# 🚦 City-Wide ANPR & Traffic Intelligence Platform
> **Smart India Hackathon (SIH 2026)**  
> *Autonomous Multi-Camera Vehicle Tracking, ANPR, Speed Estimation & Traffic Analytics*

A production-grade, modular system connecting city-wide CCTV/ANPR camera networks to transform raw video feeds into real-time vehicle intelligence, blacklist alerts, and traffic analytics.

---

## 🌟 Architecture Overview

```
[ CCTV / RTSP / Video ] 
           │
           ▼
   [ 🧠 AI Engine ]
   ├── YOLOv8 Vehicle Detection & ByteTrack
   ├── Plate Cropping (Sobel Edge Isolation)
   ├── EasyOCR Real Plate Recognition
   ├── Speed Estimation & Virtual Tripwires
   └── HTTP / WebSocket Emitter
           │
           ▼
   [ ⚡ FastAPI Backend ] ─── [ 🗄️ PostGIS Database ]
   ├── REST Endpoints (Cameras, Alerts)     ├── Camera Feeds & Geo Points
   ├── WebSocket Live Event Broadcast       ├── Plate Events & Timestamps
   └── Telemetry Aggregation                └── Blacklist & Watchlist Registry
           │
           ▼
   [ 💻 React Dashboard ]
   ├── Live CCTV Stream HUD
   ├── Real-time Map & Journey Tracking
   └── Instant Anomaly & Blacklist Alerts
```

---

## 📋 Prerequisites (What You Need Installed)

Before starting, make sure you have the following installed on your machine:

1. **Python 3.10 or 3.11**  
   👉 [Download Python](https://www.python.org/downloads/)  
   ⚠️ **CRITICAL during installation**: Check the box that says **"Add python.exe to PATH"**.
2. **Node.js (v18 or v20 LTS)**  
   👉 [Download Node.js](https://nodejs.org/)
3. **Docker Desktop**  
   👉 [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)  
   *(Make sure Docker Desktop is open and running)*.
4. **Git**  
   👉 [Download Git](https://git-scm.com/)

---

## 🚀 Quick Start Guide (Step-by-Step)

Follow these steps in order. Each service runs in its own terminal window.

---

### Step 1: Open Terminal & Navigate to Project

Open **PowerShell** (or VS Code / IDE Terminal) and navigate to the project root:

```powershell
cd C:\Users\hustl\Desktop\lapiece\la_peace_SIH26
```

---

### Step 2: Start the Database (Docker)

1. Navigate to the `docker` directory and start the PostGIS database container:
   ```powershell
   cd docker
   docker compose up -d postgis
   ```
   *(To verify it is running: `docker ps` — you should see `sih26_postgis` with Status `Up`).*

2. **Load the Database Schema**:
   Run the following command from the `docker` directory to apply tables:
   ```powershell
   Get-Content "D:\sihshiv\SIH2026-shivam\database\schema.sql" | docker exec -i sih26_postgis psql -U sih_user -d sih_db
   ```
   *(Or if `schema.sql` is placed in this workspace, replace the path accordingly).*

3. Return to the project root:
   ```powershell
   cd ..
   ```

---

### Step 3: Start the Backend (FastAPI)

Open a **New Terminal Window** and run:

```powershell
# 1. Navigate to the backend folder
cd C:\Users\hustl\Desktop\lapiece\la_peace_SIH26\backend

# 2. Activate virtual environment
..\venv\Scripts\activate

# 3. Install requirements (first time only)
pip install -r requirements.txt

# 4. Start the FastAPI server
python main.py
```

- **Interactive API Documentation**: Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.
- **Health Check**: Open [http://localhost:8000/health](http://localhost:8000/health) &rarr; `{"status": "HEALTHY"}`.

---

### Step 4: Start the Frontend Dashboard (React + Vite)

Open a **New Terminal Window** and run:

```powershell
# 1. Navigate to the frontend folder
cd C:\Users\hustl\Desktop\lapiece\la_peace_SIH26\frontend

# 2. Install dependencies (first time only)
npm install

# 3. Start the Vite development server
npm run dev
```

- Open [http://localhost:5173](http://localhost:5173) in your web browser to view the live dashboard!

---

### Step 5: Run the AI Vision & ANPR Engine

Open a **New Terminal Window** and run:

```powershell
# 1. Navigate to the project root
cd C:\Users\hustl\Desktop\lapiece\la_peace_SIH26

# 2. Run the AI pipeline with test footage
.\venv\Scripts\python.exe ai_engine\run_video_feed.py --source ai_engine\data\video_testing.mp4
```

> **Note on First Run**: EasyOCR will download its detection models (~100 MB). This is a one-time automatic download and will not happen on subsequent runs.

#### Keyboard Controls:
- **`q`**: Press `q` while focused on the video window to stop playback and export summary statistics.

#### Additional Options:
- **Run on Webcam / Live USB Camera**:
  ```powershell
  .\venv\Scripts\python.exe ai_engine\run_video_feed.py --source 0
  ```
- **Run on RTSP CCTV Stream**:
  ```powershell
  .\venv\Scripts\python.exe ai_engine\run_video_feed.py --source "rtsp://admin:password@192.168.1.50:554/live"
  ```
- **Change Virtual Tripwire (Horizontal or Vertical)**:
  ```powershell
  .\venv\Scripts\python.exe ai_engine\run_video_feed.py --source ai_engine\data\video_testing.mp4 --line-axis horizontal --line-pos 400
  ```

---

## 🛠️ Common Troubleshooting & Fixes

### 1. Port 5432 Already Allocated (`Bind for 0.0.0.0:5432 failed`)
**Cause**: Another PostgreSQL service or an existing Docker container (e.g. `cityapr-db`) is already using port 5432.  
**Fix**:
```powershell
# Stop conflicting containers
docker stop cityapr-frontend cityapr-backend cityapr-db

# Re-run your PostGIS container
cd docker
docker compose up -d postgis
```

---

### 2. OpenCV Window Error (`cv2.error: (-2:Unspecified error) The function is not implemented`)
**Cause**: Occurs if NumPy 2.x was installed or headless OpenCV was used.  
**Fix**: Run this in PowerShell to ensure the verified stable versions are installed:
```powershell
.\venv\Scripts\pip.exe install "numpy<2" "opencv-python==4.9.0.80"
```

---

### 3. Terminal Stuck on `(END)`
**Cause**: PostgreSQL table view (`\dt`) opened in a command-line pager.  
**Fix**: Simply press **`q`** on your keyboard to return to the prompt.

---

### 4. Windows Opens Microsoft Store When Typing `python`
**Cause**: PowerShell is not using the virtual environment's Python executable.  
**Fix**: Either run using the direct virtualenv path:
```powershell
.\venv\Scripts\python.exe <script_path>
```
Or activate the virtual environment in that terminal window first:
```powershell
.\venv\Scripts\activate
```

---

## 📁 Repository Structure

```text
la_peace_SIH26/
├── ai_engine/                     # Computer Vision & Deep Learning
│   ├── configs/                   # Detection & OCR pipeline thresholds
│   ├── data/                      # Test videos, plate crops, and outputs
│   ├── modules/
│   │   ├── anpr/                  # Plate candidate cropping & EasyOCR
│   │   ├── speed/                 # Pixel-to-meter speed estimator
│   │   └── zones/                 # Virtual tripwires & line cross counters
│   ├── emitters/                  # HTTP event dispatcher to FastAPI
│   └── run_video_feed.py          # Main AI runner
├── backend/                       # FastAPI REST & WebSocket Backend
│   ├── app/
│   │   ├── api/v1/                # REST & WebSocket route handlers
│   │   ├── core/                  # App configuration & settings
│   │   ├── db/                    # SQLAlchemy models & PostGIS schemas
│   │   ├── schemas/               # Pydantic data validation contracts
│   │   └── websockets/            # Real-time event broadcasting manager
│   ├── main.py                    # FastAPI server entry point
│   └── requirements.txt           # Backend dependencies
├── frontend/                      # React Dashboard UI
│   ├── src/                       # Components, CCTV HUD, Map & Alerts
│   ├── package.json               # Frontend dependencies & scripts
│   └── vite.config.js             # Vite development configuration
├── docker/                        # Containerization
│   └── docker-compose.yml         # PostGIS, Redis & Service definitions
├── contracts/                     # JSON schema specifications (AI -> Backend -> UI)
└── task.md                        # 13-Phase Project Roadmap & Tracking
```

---

## 👥 Authors & Team
- **Anunay Naman** 👋
- **Pranjul Sahu** 👋
- **SIH 2026 Team**
