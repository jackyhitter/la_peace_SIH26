"""
Single Video / RTSP Ingestion & AI Tracking Runner (Phase 4 Baseline)
Usage:
    python run_video_feed.py --source data/video_testing.mp4 --camera-id CAM_01
    python run_video_feed.py --source rtsp://... --camera-id CAM_01
    python run_video_feed.py --source 0 --camera-id CAM_01
"""

import argparse
import os
import sys
import time
from datetime import datetime

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
        "--show-window",
        action="store_true",
        default=True,
        help="Show live OpenCV display window with bounding boxes"
    )

    args = parser.parse_args()

    print("==================================================")
    print(" SIH 2026: VIDEO FEED INGESTION RUNNER (PHASE 4)")
    print("==================================================")
    print(f" Camera ID    : {args.camera_id}")
    print(f" Video Source : {args.source}")
    print(f" Backend URL  : {args.backend_url}")
    print("==================================================")

    # Check dependencies
    try:
        import cv2
        from ultralytics import YOLO
    except ImportError:
        print("\n[!] Required AI packages not found in current environment.")
        print("    Please activate the virtual environment and install requirements:")
        print("      ..\\venv\\Scripts\\activate")
        print("      pip install -r requirements.txt\n")
        return

    # Check video source
    source = 0 if args.source == "0" else args.source
    if isinstance(source, str) and not source.startswith("rtsp://") and not os.path.exists(source):
        print(f"[!] Error: Video file '{source}' not found.")
        return

    print("[+] Loading YOLOv8 detection and tracking model (yolov8n.pt)...")
    model = YOLO("yolov8n.pt") # lightweight, auto-downloads on first run

    print(f"[+] Opening video stream from: {source}")
    cap = cv2.VideoCapture(source)

    if not cap.isOpened():
        print(f"[!] Error: Failed to open video stream: {source}")
        return

    frame_count = 0
    start_time = time.time()

    # Target classes from COCO: car(2), motorcycle(3), bus(5), truck(7), person(0)
    VEHICLE_CLASSES = [0, 2, 3, 5, 7]

    print("[+] Stream started. Press 'q' in OpenCV window or Ctrl+C in terminal to stop.\n")

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print("[*] End of video stream reached.")
                break

            frame_count += 1

            # Run YOLO tracking (ByteTrack built into ultralytics)
            results = model.track(
                source=frame,
                persist=True,
                classes=VEHICLE_CLASSES,
                verbose=False
            )

            # Extract detections
            detections = []
            if results and len(results) > 0:
                boxes = results[0].boxes
                if boxes is not None:
                    for box in boxes:
                        cls_id = int(box.cls[0].item())
                        cls_name = model.names[cls_id]
                        conf = float(box.conf[0].item())
                        track_id = int(box.id[0].item()) if box.id is not None else -1
                        x1, y1, x2, y2 = box.xyxy[0].tolist()

                        detections.append({
                            "track_id": track_id,
                            "class": cls_name,
                            "confidence": round(conf, 2),
                            "bbox": [round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)]
                        })

            # Print telemetry every 30 frames
            if frame_count % 30 == 0:
                elapsed = time.time() - start_time
                fps = frame_count / elapsed if elapsed > 0 else 0
                print(f"[Frame #{frame_count:05d}] FPS: {fps:.1f} | Active Vehicles: {len(detections)}")
                for det in detections[:3]: # print first 3
                    print(f"   -> ID #{det['track_id']} {det['class']} ({det['confidence']}) at {det['bbox']}")

            # Display video window if enabled
            if args.show_window:
                annotated_frame = results[0].plot() if results else frame
                cv2.imshow(f"SIH 2026 - {args.camera_id}", annotated_frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    print("[*] Quitting by user keypress.")
                    break

    except KeyboardInterrupt:
        print("\n[*] Interrupted by user.")
    finally:
        cap.release()
        if args.show_window:
            cv2.destroyAllWindows()
        print(f"[+] Processed {frame_count} frames total.")

if __name__ == "__main__":
    main()
