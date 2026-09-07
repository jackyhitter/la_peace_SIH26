"""
Robust Virtual Line Crossing & Tripwire Module
Supports both vertical and horizontal tripwires with a configurable crossing corridor.
"""

class LineCrossDetector:
    def __init__(self, mode: str = "vertical", position: int = 384):
        """
        :param mode: "vertical" (line at x = position, vehicles move left <-> right)
                     or "horizontal" (line at y = position, vehicles move up <-> down)
        :param position: pixel coordinate for the line
        """
        self.mode = mode
        self.position = position
        self.prev_positions = {} # track_id -> previous coordinate (x or y)
        self.crossed_tracks = set()

        self.in_count = 0
        self.out_count = 0
        self.wrong_way_violations = []

    def check_crossing(self, track_id: int, bbox: list) -> dict:
        """
        Detects when vehicle centroid crosses the tripwire threshold.
        """
        if track_id < 0:
            return {"crossed": False, "direction": "NONE", "wrong_way": False}

        cx = (bbox[0] + bbox[2]) / 2.0
        cy = (bbox[1] + bbox[3]) / 2.0

        curr_val = cx if self.mode == "vertical" else cy

        if track_id not in self.prev_positions:
            self.prev_positions[track_id] = curr_val
            return {"crossed": False, "direction": "NONE", "wrong_way": False}

        prev_val = self.prev_positions[track_id]
        self.prev_positions[track_id] = curr_val

        # Check if crossed the line threshold between frames
        crossed_forward = prev_val < self.position <= curr_val
        crossed_backward = prev_val > self.position >= curr_val

        if (crossed_forward or crossed_backward) and track_id not in self.crossed_tracks:
            self.crossed_tracks.add(track_id)

            if self.mode == "vertical":
                direction = "LEFT_TO_RIGHT" if crossed_forward else "RIGHT_TO_LEFT"
            else:
                direction = "TOP_TO_BOTTOM" if crossed_forward else "BOTTOM_TO_TOP"

            if crossed_forward:
                self.in_count += 1
            else:
                self.out_count += 1

            return {
                "crossed": True,
                "direction": direction,
                "wrong_way": False,
                "total_in": self.in_count,
                "total_out": self.out_count
            }

        return {"crossed": False, "direction": "NONE", "wrong_way": False}
