"""
Plate Cropper & Preprocessor Module
Extracts the license plate candidate region from detected vehicle bounding boxes.
"""

import cv2
import numpy as np

class PlateCropper:
    def __init__(self, crop_lower_ratio: float = 0.55):
        """
        :param crop_lower_ratio: Height fraction from which to crop plate region (e.g. lower 45% of vehicle)
        """
        self.crop_lower_ratio = crop_lower_ratio

    def crop_vehicle(self, frame: np.ndarray, bbox: list) -> np.ndarray:
        """Crops vehicle region with boundary protection."""
        h, w = frame.shape[:2]
        x1, y1, x2, y2 = [int(v) for v in bbox]
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w, x2), min(h, y2)

        if x2 <= x1 or y2 <= y1:
            return None
        return frame[y1:y2, x1:x2]

    def extract_plate_candidate(self, vehicle_crop: np.ndarray) -> np.ndarray:
        """
        Extracts the lower portion of the vehicle where license plates reside
        and applies contrast enhancement for OCR.
        """
        if vehicle_crop is None or vehicle_crop.size == 0:
            return None

        vh, vw = vehicle_crop.shape[:2]
        start_y = int(vh * self.crop_lower_ratio)
        # Margin crop to avoid wheel/road clutter
        plate_region = vehicle_crop[start_y:vh, int(vw * 0.1):int(vw * 0.9)]

        if plate_region.size == 0:
            return None

        # Preprocessing for OCR: Grayscale + CLAHE contrast enhancement
        gray = cv2.cvtColor(plate_region, cv2.COLOR_BGR2GRAY)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)

        return enhanced
