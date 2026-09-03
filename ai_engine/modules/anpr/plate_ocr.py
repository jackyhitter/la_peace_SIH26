"""
Plate OCR Module
Extracts real alphanumeric text from license plate crops using EasyOCR.
Does NOT force or fake country-specific formats.
"""

import re
import cv2
import numpy as np

class PlateOCR:
    def __init__(self, use_easyocr: bool = True):
        self.reader = None
        if use_easyocr:
            try:
                import easyocr
                # Initialize English language reader
                print("[+] Initializing EasyOCR engine (en)...")
                self.reader = easyocr.Reader(['en'], gpu=False, verbose=False)
                print("[+] EasyOCR initialized successfully.")
            except Exception as e:
                print(f"[!] EasyOCR not yet ready or failed: {e}")

    def clean_text(self, text: str) -> str:
        """Keeps alphanumerics and single spaces."""
        cleaned = re.sub(r'[^A-Z0-9 ]', '', text.upper()).strip()
        return re.sub(r'\s+', ' ', cleaned)

    def preprocess_for_ocr(self, plate_crop: np.ndarray) -> np.ndarray:
        """Enhances contrast and sharpness for OCR text extraction."""
        if plate_crop is None or plate_crop.size == 0:
            return None

        # Resize if plate is small to improve character detection
        h, w = plate_crop.shape[:2]
        if h < 50:
            scale = 50.0 / h
            plate_crop = cv2.resize(plate_crop, (int(w * scale), 50), interpolation=cv2.INTER_CUBIC)

        gray = cv2.cvtColor(plate_crop, cv2.COLOR_BGR2GRAY) if len(plate_crop.shape) == 3 else plate_crop
        # Contrast Limited Adaptive Histogram Equalization
        clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        return enhanced

    def read_plate(self, plate_crop: np.ndarray, track_id: int = -1) -> dict:
        """
        Runs real OCR on plate crop. Returns exact detected plate text without faking format.
        """
        if plate_crop is None or plate_crop.size == 0:
            return {"plate": None, "confidence": 0.0}

        if self.reader is not None:
            try:
                enhanced = self.preprocess_for_ocr(plate_crop)
                results = self.reader.readtext(enhanced, detail=1, paragraph=False)
                if results and len(results) > 0:
                    # Filter detections with alphanumeric text
                    candidates = []
                    for bbox, raw_text, conf in results:
                        cleaned = self.clean_text(raw_text)
                        # License plates typically have at least 4 alphanumeric characters
                        if len(cleaned.replace(' ', '')) >= 4 and conf > 0.20:
                            candidates.append((cleaned, float(conf)))

                    if candidates:
                        best_text, best_conf = max(candidates, key=lambda c: c[1])
                        return {
                            "plate": best_text,
                            "confidence": round(best_conf, 2),
                            "raw": best_text
                        }
            except Exception as e:
                pass

        return {"plate": None, "confidence": 0.0}
