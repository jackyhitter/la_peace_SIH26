"""
Speed Estimation Module
Calculates real-world speed (km/h) from pixel trajectory displacement and camera calibration.
"""

import math
from collections import defaultdict

class SpeedEstimator:
    def __init__(self, fps: float = 25.0, meters_per_pixel: float = 0.05, speed_limit_kmh: float = 60.0):
        """
        :param fps: Video capture frames per second.
        :param meters_per_pixel: Scaling factor converting pixel distance to real-world meters.
        :param speed_limit_kmh: Threshold above which an OVERSPEED alert is triggered.
        """
        self.fps = fps
        self.meters_per_pixel = meters_per_pixel
        self.speed_limit_kmh = speed_limit_kmh

        # History: track_id -> list of (frame_num, center_x, center_y, timestamp)
        self.track_history = defaultdict(list)
        # Smoothed speeds: track_id -> float
        self.current_speeds = {}

    def _get_bbox_center(self, bbox: list) -> tuple:
        x1, y1, x2, y2 = bbox
        return ((x1 + x2) / 2.0, (y1 + y2) / 2.0)

    def update(self, track_id: int, bbox: list, frame_id: int) -> dict:
        """
        Updates tracking history for a vehicle and estimates its instantaneous and smoothed speed.
        :returns: {"speed_kmh": float, "overspeed": bool, "direction_deg": float}
        """
        if track_id < 0:
            return {"speed_kmh": 0.0, "overspeed": False, "direction_deg": 0.0}

        cx, cy = self._get_bbox_center(bbox)
        history = self.track_history[track_id]
        history.append((frame_id, cx, cy))

        # Keep last 15 frames for velocity calculation
        if len(history) > 15:
            history.pop(0)

        # Need at least 5 frames to compute a stable delta
        if len(history) < 5:
            return {"speed_kmh": self.current_speeds.get(track_id, 0.0), "overspeed": False, "direction_deg": 0.0}

        prev_frame, px, py = history[0]
        curr_frame, cx, cy = history[-1]

        frame_delta = curr_frame - prev_frame
        if frame_delta <= 0:
            return {"speed_kmh": self.current_speeds.get(track_id, 0.0), "overspeed": False, "direction_deg": 0.0}

        time_delta_sec = frame_delta / self.fps
        dx = cx - px
        dy = cy - py
        pixel_dist = math.sqrt(dx * dx + dy * dy)
        meters_dist = pixel_dist * self.meters_per_pixel

        # Convert m/s to km/h
        raw_speed_kmh = (meters_dist / time_delta_sec) * 3.6

        # Direction angle (0-360 degrees)
        direction_deg = (math.degrees(math.atan2(dy, dx)) + 360) % 360

        # Exponential Moving Average (EMA) smoothing: alpha=0.3
        prev_speed = self.current_speeds.get(track_id, raw_speed_kmh)
        smoothed_speed = round(0.3 * raw_speed_kmh + 0.7 * prev_speed, 1)
        self.current_speeds[track_id] = smoothed_speed

        return {
            "speed_kmh": smoothed_speed,
            "overspeed": smoothed_speed > self.speed_limit_kmh,
            "direction_deg": round(direction_deg, 1)
        }
