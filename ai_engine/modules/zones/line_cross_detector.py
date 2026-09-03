"""
Virtual Line Crossing & Direction Anomaly Detector
Detects tripwire crossings (entry/exit counts) and wrong-way direction violations.
"""

from collections import defaultdict

class LineCrossDetector:
    def __init__(self, line_p1: tuple = (100, 300), line_p2: tuple = (700, 300), expected_direction: str = "DOWN"):
        """
        :param line_p1: (x1, y1) start coordinate of the virtual line
        :param line_p2: (x2, y2) end coordinate of the virtual line
        :param expected_direction: 'DOWN' (y increasing), 'UP' (y decreasing), 'LEFT', 'RIGHT'
        """
        self.line_p1 = line_p1
        self.line_p2 = line_p2
        self.expected_direction = expected_direction

        # Track history: track_id -> previous centroid (cx, cy)
        self.prev_centroids = {}
        # Crossed tracks cache to prevent double-counting: set of track_ids
        self.crossed_tracks = set()

        self.in_count = 0
        self.out_count = 0
        self.wrong_way_violations = []

    def _ccw(self, A, B, C):
        """Orientation test: returns true if points A, B, C are counter-clockwise."""
        return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0])

    def _intersect(self, A, B, C, D):
        """Returns true if line segment AB intersects with line segment CD."""
        return self._ccw(A, C, D) != self._ccw(B, C, D) and self._ccw(A, B, C) != self._ccw(A, B, D)

    def check_crossing(self, track_id: int, bbox: list) -> dict:
        """
        Checks if vehicle centroid crossed the virtual line.
        :returns: {"crossed": bool, "direction": str, "wrong_way": bool}
        """
        if track_id < 0:
            return {"crossed": False, "direction": "NONE", "wrong_way": False}

        cx = (bbox[0] + bbox[2]) / 2.0
        cy = (bbox[1] + bbox[3]) / 2.0
        curr_pt = (cx, cy)

        if track_id not in self.prev_centroids:
            self.prev_centroids[track_id] = curr_pt
            return {"crossed": False, "direction": "NONE", "wrong_way": False}

        prev_pt = self.prev_centroids[track_id]
        self.prev_centroids[track_id] = curr_pt

        # Check line segment intersection
        if self._intersect(prev_pt, curr_pt, self.line_p1, self.line_p2):
            if track_id not in self.crossed_tracks:
                self.crossed_tracks.add(track_id)

                # Determine direction based on dy or dx
                dy = curr_pt[1] - prev_pt[1]
                actual_dir = "DOWN" if dy > 0 else "UP"

                is_wrong_way = False
                if self.expected_direction in ["DOWN", "UP"]:
                    is_wrong_way = actual_dir != self.expected_direction

                if is_wrong_way:
                    self.wrong_way_violations.append({
                        "track_id": track_id,
                        "direction": actual_dir,
                        "expected": self.expected_direction
                    })

                if actual_dir == "DOWN":
                    self.in_count += 1
                else:
                    self.out_count += 1

                return {
                    "crossed": True,
                    "direction": actual_dir,
                    "wrong_way": is_wrong_way,
                    "total_in": self.in_count,
                    "total_out": self.out_count
                }

        return {"crossed": False, "direction": "NONE", "wrong_way": False}
