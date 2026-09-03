# AI Test Videos Directory

Place test traffic video clips here for local testing (Phase 4).

### Supported formats:
- `.mp4` (recommended: 720p or 1080p, 25/30 FPS)
- `.avi`
- `.mkv`

### Example:
Place `traffic_test.mp4` in this folder:
```powershell
ai_engine/data/traffic_test.mp4
```

Then run:
```powershell
python run_video_feed.py --source data/traffic_test.mp4 --camera-id CAM_01
```
