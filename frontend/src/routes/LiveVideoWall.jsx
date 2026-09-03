import React, { useState } from 'react';

export default function LiveVideoWall() {
  const [selectedCam, setSelectedCam] = useState('CAM_01');

  const cameras = [
    { id: 'CAM_01', name: 'Sector 17 North Gate', rtsp: 'rtsp://192.168.1.101:554/live/ch0', status: 'ONLINE', fps: 25.0, bitrate: '4096 kbps' },
    { id: 'CAM_02', name: 'Madhya Marg Junction', rtsp: 'rtsp://192.168.1.102:554/live/ch0', status: 'ONLINE', fps: 24.8, bitrate: '4120 kbps' },
    { id: 'CAM_03', name: 'Tribune Chowk Flyover', rtsp: 'rtsp://192.168.1.103:554/live/ch0', status: 'ONLINE', fps: 25.0, bitrate: '3980 kbps' },
    { id: 'CAM_04', name: 'IT Park Roundabout', rtsp: 'rtsp://192.168.1.104:554/live/ch0', status: 'DEGRADED', fps: 14.2, bitrate: '1800 kbps' }
  ];

  return (
    <div className="raw-split">
      <div className="raw-box">
        <div className="raw-box-title">[MODULE: VIDEO_WALL] - RTSP CAMERA BOXES</div>
        <div className="raw-video-grid">
          {cameras.map((cam) => (
            <div 
              key={cam.id} 
              className="raw-video-box"
              style={{ 
                borderColor: selectedCam === cam.id ? '#000000' : '#cccccc',
                borderWidth: selectedCam === cam.id ? '2px' : '1px'
              }}
              onClick={() => setSelectedCam(cam.id)}
            >
              <div className="raw-video-meta">
                <span>[{cam.id}] {cam.name}</span>
                <span>STATUS: {cam.status}</span>
              </div>
              <div className="raw-video-placeholder">
                <div>
                  <div>[VIDEO STREAM BOX]</div>
                  <div style={{ marginTop: '6px', fontSize: '10px' }}>{cam.rtsp}</div>
                  <div style={{ marginTop: '4px', fontSize: '10px' }}>FPS: {cam.fps} | BITRATE: {cam.bitrate}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '4px' }}>
                <span>FRAME: #18920</span>
                <span>CLICK TO INSPECT</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="raw-box">
        <div className="raw-box-title">[INSPECTOR] - RAW FEED METADATA ({selectedCam})</div>
        <pre className="raw-pre">
{JSON.stringify({
  selected_camera: selectedCam,
  decoder: "FFmpeg H.264 / GStreamer",
  resolution: "1920x1080",
  dropped_frames: 0,
  ai_pipeline_attached: true,
  inference_worker: "yolo_worker_01",
  active_tracks: [
    { track_id: 182, class: "car", bbox: [0.22, 0.45, 0.48, 0.78], plate: "CH01AB1234" },
    { track_id: 183, class: "motorcycle", bbox: [0.65, 0.50, 0.72, 0.82], helmet: false }
  ]
}, null, 2)}
        </pre>
      </div>
    </div>
  );
}
