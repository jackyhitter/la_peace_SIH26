"""
Single Video / RTSP Ingestion & AI Tracking Runner (Phase 4 & 6 Scaled Pipeline)
Features:
- YOLOv8 Multi-Object Vehicle Detection
- ByteTrack Persistent ID Tracking
- Dynamic Plate Cropping & Candidate Extraction
- Pixel-to-Meter Speed Estimation (km/h) with Overspeed Detection
- Virtual Line Crossing (In/Out Counting & Wrong-Way Detection)
- HTTP Event Dispatcher to FastAPI Backend
"""

import argparse
import os
import sys
import time
import cv2
import numpy as np

# Add parent directory to path so relative imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from modules.anpr.plate_cropper import PlateCropper
from modules.anpr.plate_ocr import PlateOCR
from modules.speed.speed_estimator import SpeedEstimator
from modules.zones.line_cross_detector import LineCrossDetector
from emitters.http_emitter import HTTPEmitter

def main():
    parser = argparse.ArgumentParser(description="Feed Video / RTSP to AI Detection Engine")
    parser.add_argument(
        "--source",
        type=str,
        default="data/video_testing.mp4",
        help="Path to local .mp4 video file, RTSP URL, or 0 for webcam"
    )
    parser.add_argument(
        "--camera-id",
        type=str,
        default="CAM_01",
        help="Camera identifier (e.g. CAM_01, CAM_SECTOR_17)"
    )
    parser.add_argument(
        "--backend-url",
        type=str,
        default="http://localhost:8000/api/v1/events/inference",
        help="FastAPI endpoint to receive raw AI detections"
    )
    parser.add_argument(
        "--speed-limit",
        type=float,
        default=60.0,
        help="Speed limit in km/h for overspeed alerts"
    )
    parser.add_argument(
        "--show-window",
        action="store_true",
        default=True,
        help="Show live OpenCV display window with bounding boxes"
    )

    args = parser.parse_args()

    print("==================================================")
    print(" SIH 2026: SCALABLE CV PIPELINE RUNNER")
    print("==================================================")
    print(f" Camera ID    : {args.camera_id}")
    print(f" Video Source : {args.source}")
    print(f" Speed Limit  : {args.speed_limit} km/h")
    print(f" Backend URL  : {args.backend_url}")
    print("==================================================")

    from ultralytics import YOLO

    source = 0 if args.source == "0" else args.source
    if isinstance(source, str) and not source.startswith("rtsp://") and not os.path.exists(source):
        print(f"[!] Error: Video file '{source}' not found.")
        return

    print("[+] Initializing specialized analytics modules...")
    cropper = PlateCropper(crop_lower_ratio=0.55)
    ocr = PlateOCR(use_easyocr=False) # lightweight fallback, can be set to True if easyocr is installed
    speed_est = SpeedEstimator(fps=25.0, meters_per_pixel=0.06, speed_limit_kmh=args.speed_limit)
    line_detector = LineCrossDetector(line_p1=(50, 240), line_p2=(720, 240), expected_direction="DOWN")
    emitter = HTTPEmitter(backend_url=args.backend_url)

    print("[+] Loading YOLOv8 model (yolov8n.pt)...")
    model = YOLO("yolov8n.pt")

    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        print(f"[!] Error: Failed to open video stream: {source}")
        return

    frame_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 800
    frame_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 600
    # Adjust virtual line dynamically to frame size
    line_detector.line_p1 = (int(frame_w * 0.1), int(frame_h * 0.55))
    line_detector.line_p2 = (int(frame_w * 0.9), int(frame_h * 0.55))

    frame_count = 0
    start_time = time.time()
    VEHICLE_CLASSES = [0, 2, 3, 5, 7] # person, car, motorcycle, bus, truck

    print("[+] Pipeline running. Press 'q' in video window or Ctrl+C in terminal to stop.\n")

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print("[*] End of video stream reached.")
                break

            frame_count += 1

            # Run YOLO Tracking
            results = model.track(
                source=frame,
                persist=True,
                classes=VEHICLE_CLASSES,
                verbose=False
            )

            annotated_frame = frame.copy()

            # Draw Virtual Line
            cv2.line(annotated_frame, line_detector.line_p1, line_detector.line_p2, (0, 0, 255), 2)
            cv2.putText(
                annotated_frame,
                f"VIRTUAL LINE | IN: {line_detector.in_count} | OUT: {line_detector.out_count}",
                (line_detector.line_p1[0], line_detector.line_p1[1] - 8),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2
            )

            detections_summary = []

            if results and len(results) > 0:
                boxes = results[0].boxes
                if boxes is not None:
                    for box in boxes:
                        cls_id = int(box.cls[0].item())
                        cls_name = model.names[cls_id]
                        conf = float(box.conf[0].item())
                        track_id = int(box.id[0].item()) if box.id is not None else -1
                        x1, y1, x2, y2 = [int(v) for v in box.xyxy[0].tolist()]

                        # 1. Speed Estimation
                        speed_info = speed_est.update(track_id, [x1, y1, x2, y2], frame_count)
                        speed_kmh = speed_info["speed_kmh"]
                        is_overspeed = speed_info["overspeed"]

                        # 2. Virtual Line Crossing Check
                        crossing_info = line_detector.check_crossing(track_id, [x1, y1, x2, y2])

                        # 3. Plate Cropping
                        veh_crop = cropper.crop_vehicle(frame, [x1, y1, x2, y2])
                        plate_candidate = cropper.extract_plate_candidate(veh_crop)

                        # Draw bounding box (Red if overspeeding, Green otherwise)
                        color = (0, 0, 255) if is_overspeed else (0, 255, 0)
                        cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 2)

                        # Labels
                        label = f"#{track_id} {cls_name} | {speed_kmh} km/h"
                        if is_overspeed:
                            label += " [SPEED VIOLATION!]"
                        if crossing_info.get("wrong_way"):
                            label += " [WRONG WAY!]"

                        cv2.putText(
                            annotated_frame, label, (x1, max(20, y1 - 6)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2
                        )

                        detections_summary.append({
                            "track_id": track_id,
                            "class": cls_name,
                            "speed_kmh": speed_kmh,
                            "overspeed": is_overspeed,
                            "wrong_way": crossing_info.get("wrong_way", False)
                        })

                        # 4. Optional HTTP emission to backend
                        if frame_count % 15 == 0 and track_id > 0:
                            emitter.emit_event({
                                "camera_id": args.camera_id,
                                "track_id": track_id,
                                "vehicle_class": cls_name,
                                "bbox": {"x_min": x1/frame_w, "y_min": y1/frame_h, "x_max": x2/frame_w, "y_max": y2/frame_h},
                                "confidence": round(conf, 2),
                                "speed_kmh": speed_kmh
                            })

            # Print telemetry periodically
            if frame_count % 30 == 0:
                elapsed = time.time() - start_time
                fps = frame_count / elapsed if elapsed > 0 else 0
                print(f"[Frame #{frame_count:05d}] FPS: {fps:.1f} | Active: {len(detections_summary)} | Total In: {line_detector.in_count}")
                for d in detections_summary[:2]:
                    flag = " (!)" if d["overspeed"] or d["wrong_way"] else ""
                    print(f"   -> #{d['track_id']} {d['class']} @ {d['speed_kmh']} km/h{flag}")

            if args.show_window:
                cv2.imshow(f"SIH 2026 Analytics - {args.camera_id}", annotated_frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    print("[*] Quitting by user keypress.")
                    break

    except KeyboardInterrupt:
        print("\n[*] Interrupted by user.")
    finally:
        cap.release()
        if args.show_window:
            cv2.destroyAllWindows()
        print(f"[+] Total frames processed: {frame_count}")
        print(f"[+] Traffic stats: {line_detector.in_count} entered, {line_detector.out_count} exited.")
        print(f"[+] Violations logged: {len(line_detector.wrong_way_violations)} wrong-way incidents.")

if __name__ == "__main__":
    main()
