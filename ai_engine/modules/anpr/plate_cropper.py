"""
Plate Cropper & Exact Plate Localizer Module
Uses Sobel gradient and morphological edge grouping to isolate the real rectangular license plate
inside the vehicle bounding box.
"""

import os
import cv2
import numpy as np

class PlateCropper:
    def __init__(self, output_dir: str = "data/plate_crops"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        self.saved_tracks = set()

    def crop_vehicle(self, frame: np.ndarray, bbox: list) -> np.ndarray:
        h, w = frame.shape[:2]
        x1, y1, x2, y2 = [int(v) for v in bbox]
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w, x2), min(h, y2)
        if x2 <= x1 or y2 <= y1:
            return None
        return frame[y1:y2, x1:x2]

    def find_plate_contour(self, vehicle_crop: np.ndarray) -> np.ndarray:
        """
        Detects the high-gradient rectangular plate region inside the vehicle crop.
        Works for both European/UK long oblong plates (AR 4.0-5.5) and square/standard plates (AR 2.0-3.5).
        """
        if vehicle_crop is None or vehicle_crop.size == 0:
            return None

        vh, vw = vehicle_crop.shape[:2]
        if vh < 30 or vw < 50:
            return vehicle_crop

        # Limit search to the bumper region (exclude top windshield & bottom ground)
        search_region = vehicle_crop[int(vh * 0.25):int(vh * 0.85), :]
        if search_region.size == 0:
            return vehicle_crop

        gray = cv2.cvtColor(search_region, cv2.COLOR_BGR2GRAY)
        
        # Vertical edges (Sobel-X) - plates have strong vertical stroke density from characters
        sobelx = cv2.Sobel(gray, cv2.CV_8U, 1, 0, ksize=3)
        _, thresh = cv2.threshold(sobelx, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # Morphological closing horizontally to connect character strokes into a plate rectangle
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (17, 3))
        morph = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

        contours, _ = cv2.findContours(morph, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        best_candidate = None
        max_score = -1

        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)
            ar = w / float(h) if h > 0 else 0
            area = w * h

            # Valid plate dimensions: aspect ratio between 1.8 and 6.0
            if 1.8 <= ar <= 6.0 and w >= 40 and h >= 12 and area >= 600:
                # Prefer plates that are reasonably centered and have balanced dimensions
                score = area * (1.0 - abs(ar - 3.5) / 5.0)
                if score > max_score:
                    max_score = score
                    # Convert coordinates back to search_region
                    best_candidate = (x, y, w, h)

        if best_candidate is not None:
            bx, by, bw, bh = best_candidate
            # Add small padding
            pad_x = int(bw * 0.05)
            pad_y = int(bh * 0.10)
            py1 = max(0, by - pad_y)
            py2 = min(search_region.shape[0], by + bh + pad_y)
            px1 = max(0, bx - pad_x)
            px2 = min(search_region.shape[1], bx + bw + pad_x)
            plate_crop = search_region[py1:py2, px1:px2]
            if plate_crop.size > 0:
                return plate_crop

        # Fallback: center bumper crop
        return vehicle_crop[int(vh * 0.35):int(vh * 0.75), int(vw * 0.2):int(vw * 0.85)]

    def extract_and_save_plate(self, frame: np.ndarray, bbox: list, track_id: int) -> dict:
        vehicle_crop = self.crop_vehicle(frame, bbox)
        if vehicle_crop is None or vehicle_crop.size == 0:
            return None

        plate_img = self.find_plate_contour(vehicle_crop)
        if plate_img is None or plate_img.size == 0:
            plate_img = vehicle_crop

        save_path = None
        if track_id > 0 and track_id not in self.saved_tracks:
            self.saved_tracks.add(track_id)
            save_path = os.path.join(self.output_dir, f"plate_track_{track_id}.jpg")
            try:
                cv2.imwrite(save_path, plate_img)
            except Exception:
                pass

        return {
            "plate_img": plate_img,
            "vehicle_crop": vehicle_crop,
            "saved_path": save_path
        }
