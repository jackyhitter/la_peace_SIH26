# ANPR System

This is the repository for the ANPR (Automatic Number Plate Recognition) system for SIH 2026.

## Structure Overview
- **frontend/**: Contains the React (Vite) frontend application.
- **backend/**: Contains the FastAPI backend application.
- **database/**: Contains the database schema and indexes.
- **docs/**: Documentation about the API and schemas.
- **ai/**: Currently empty (placeholder for AI models and scripts).
- **data/**: Currently empty (placeholder for data files and datasets).
- **weights/**: Currently empty (placeholder for ML model weights).

## How to Run

### Backend Server (FastAPI)
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment (if not already activated):
   ```bash
   # Windows
   ..\venv\Scripts\activate
   # Linux/macOS
   source ../venv/bin/activate
   ```
3. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be available at `http://127.0.0.1:8000`.

### Frontend Server (React/Vite)
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://127.0.0.1:5173`.
