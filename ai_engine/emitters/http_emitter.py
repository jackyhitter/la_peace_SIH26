"""
HTTP Event Emitter (Phase 6 Integration)
Pushes inference events to the FastAPI backend asynchronously without blocking video processing.
"""

import json
import logging
import requests

class HTTPEmitter:
    def __init__(self, backend_url: str = "http://localhost:8000/api/v1/events/inference", timeout_sec: float = 0.5):
        self.backend_url = backend_url
        self.timeout_sec = timeout_sec

    def emit_event(self, event_payload: dict) -> bool:
        """
        Sends an inference event JSON payload to the FastAPI backend.
        """
        try:
            resp = requests.post(
                self.backend_url,
                json=event_payload,
                timeout=self.timeout_sec
            )
            return resp.status_code == 200
        except Exception:
            # Non-blocking: fail gracefully if backend is offline
            return False
