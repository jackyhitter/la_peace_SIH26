"""
Plate OCR & Indian License Plate Normalization Module
"""

import re
import numpy as np

class PlateOCR:
    INDIAN_STATE_CODES = {
        "AN", "AP", "AR", "AS", "BR", "CH", "CG", "DD", "DL", "DN", "GA",
        "GJ", "HP", "HR", "JH", "JK", "KA", "KL", "LA", "LD", "MH", "ML",
        "MN", "MP", "MZ", "NL", "OD", "PB", "PY", "RJ", "SK", "TN", "TR",
        "TS", "UK", "UP", "WB"
    }

    def __init__(self, use_easyocr: bool = False):
        self.reader = None
        if use_easyocr:
            try:
                import easyocr
                self.reader = easyocr.Reader(['en'], gpu=False)
            except Exception as e:
                print(f"[!] EasyOCR initialization note: {e}")

    def clean_text(self, text: str) -> str:
        """Removes spaces, punctuation and keeps uppercase alphanumerics."""
        return re.sub(r'[^A-Z0-9]', '', text.upper())

    def validate_and_format(self, text: str) -> dict:
        """
        Validates text against standard Indian number plate patterns.
        Example: CH01AB1234, DL8CAA1020, HR26DK9981
        """
        cleaned = self.clean_text(text)
        if len(cleaned) < 6:
            return {"valid": False, "plate": cleaned, "state": None, "confidence": 0.0}

        state_prefix = cleaned[:2]
        is_known_state = state_prefix in self.INDIAN_STATE_CODES

        return {
            "valid": is_known_state and len(cleaned) >= 8,
            "plate": cleaned,
            "state": state_prefix if is_known_state else "UNKNOWN",
            "length": len(cleaned)
        }

    def read_plate(self, plate_img: np.ndarray) -> dict:
        """
        Runs OCR on plate crop.
        """
        if plate_img is None:
            return {"plate": None, "confidence": 0.0}

        if self.reader:
            try:
                results = self.reader.readtext(plate_img)
                if results:
                    # Sort by confidence
                    best_match = max(results, key=lambda r: r[2])
                    raw_text, conf = best_match[1], float(best_match[2])
                    parsed = self.validate_and_format(raw_text)
                    parsed["confidence"] = round(conf, 2)
                    return parsed
            except Exception:
                pass

        return {"plate": None, "confidence": 0.0}
