import React, { useState, useCallback } from 'react';
import { 
  Grid, 
  Maximize2, 
  Columns, 
  Layers, 
  Radio, 
  Eye, 
  EyeOff, 
  Cpu, 
  Sparkles,
  Shield,
  Activity,
  UploadCloud
} from 'lucide-react';
import CameraFeedTile from './CameraFeedTile';

export default function MultiCameraGrid({ onAiEvent }) {
  // 4 Default Realistic Chandigarh ANPR Camera Feeds
  const [cameras, setCameras] = useState([
    {
      id: 'CAM-01',
      name: 'CAM-01 [JAN MARG / CAPITOL]',
      sector: 'Sector 1 / Jan Marg',
      url: `http://${window.location.hostname}:5000/video_feed`,
      type: 'live_ai',
      isLiveAI: true,
      fps: '30.0',
      resolution: '1080P FHD',
      fileName: null
    },
    {
      id: 'CAM-02',
      name: 'CAM-02 [BOULEVARD RD NORTH]',
      sector: 'Sector 2 / Boulevard',
      url: '/sample_video.mp4',
      type: 'sample',
      isLiveAI: false,
      fps: '29.97',
      resolution: '1080P FHD',
      fileName: null
    },
    {
      id: 'CAM-03',
      name: 'CAM-03 [SUKHNA LAKE GATE]',
      sector: 'Sector 3 / Entry Gate',
      url: '/sample_video.mp4',
      type: 'sample',
      isLiveAI: false,
      fps: '30.0',
      resolution: '1080P FHD',
      fileName: null
    },
    {
      id: 'CAM-04',
      name: 'CAM-04 [GOLF COURSE CHOWK]',
      sector: 'Sector 4 / Roundabout',
      url: '/sample_video.mp4',
      type: 'sample',
      isLiveAI: false,
      fps: '25.0',
      resolution: '1080P FHD',
      fileName: null
    }
  ]);

  // Layout mode: 'grid-2x2', 'focus', '1+3'
  const [layoutMode, setLayoutMode] = useState('grid-2x2');
  const [focusedCameraId, setFocusedCameraId] = useState('CAM-01');
  const [showAiOverlay, setShowAiOverlay] = useState(true);
  const [stealthMode, setStealthMode] = useState(false);

  // Update source for a specific camera (e.g. when video is dropped or selected)
  const handleSourceChange = useCallback((cameraId, newSource) => {
    setCameras(prev => prev.map(cam => {
      if (cam.id === cameraId) {
        return {
          ...cam,
          ...newSource
        };
      }
      return cam;
    }));
  }, []);

  const toggleMaximize = useCallback((cameraId) => {
    if (layoutMode === 'focus' && focusedCameraId === cameraId) {
      setLayoutMode('grid-2x2');
    } else {
      setFocusedCameraId(cameraId);
      setLayoutMode('focus');
    }
  }, [layoutMode, focusedCameraId]);

  return (
    <div className="flex-1 flex flex-col bg-[#111111] border border-[#222222] rounded-lg overflow-hidden shadow-sm min-h-[550px]">
      
      {/* CCTV Operations Command Bar */}
      <div className="px-4 py-2.5 bg-[#171717] border-b border-[#242424] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Matrix Title & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-[#22C55E] animate-pulse" />
            <h3 className="text-xs font-mono font-bold tracking-wider text-[#F0F0F0] uppercase">
              CCTV Surveillance Matrix
            </h3>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono text-[#888888] bg-[#1E1E1E] px-2.5 py-1 rounded border border-[#2A2A2A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            4/4 CHANNELS SYNCHRONIZED
          </span>
        </div>

        {/* Right: Layout Switcher, AI Overlay Toggle & Stealth Mode */}
        <div className="flex items-center gap-2">
          {/* AI Vision HUD Toggle */}
          <button
            onClick={() => setShowAiOverlay(!showAiOverlay)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-all border ${
              showAiOverlay 
                ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]' 
                : 'bg-[#1C1C1C] border-[#2A2A2A] text-[#777777] hover:text-[#CCCCCC]'
            }`}
            title="Toggle AI Detection Bounding Boxes & Plates HUD"
          >
            <Cpu size={12} />
            <span>AI HUD: {showAiOverlay ? 'ON' : 'OFF'}</span>
          </button>

          {/* Layout Controls */}
          <div className="flex items-center bg-[#1C1C1C] p-0.5 rounded border border-[#2A2A2A]">
            <button
              onClick={() => setLayoutMode('grid-2x2')}
              className={`p-1.5 rounded text-[11px] transition-colors ${
                layoutMode === 'grid-2x2' 
                  ? 'bg-[#2B2B2B] text-[#F0F0F0]' 
                  : 'text-[#777777] hover:text-[#CCCCCC]'
              }`}
              title="2x2 Grid View (4 Cameras)"
            >
              <Grid size={14} />
            </button>

            <button
              onClick={() => setLayoutMode('1+3')}
              className={`p-1.5 rounded text-[11px] transition-colors ${
                layoutMode === '1+3' 
                  ? 'bg-[#2B2B2B] text-[#F0F0F0]' 
                  : 'text-[#777777] hover:text-[#CCCCCC]'
              }`}
              title="1 Main + 3 Thumbnails"
            >
              <Columns size={14} />
            </button>

            <button
              onClick={() => {
                setLayoutMode('focus');
                if (!focusedCameraId) setFocusedCameraId('CAM-01');
              }}
              className={`p-1.5 rounded text-[11px] transition-colors ${
                layoutMode === 'focus' 
                  ? 'bg-[#2B2B2B] text-[#F0F0F0]' 
                  : 'text-[#777777] hover:text-[#CCCCCC]'
              }`}
              title="Single Focused Camera"
            >
              <Maximize2 size={14} />
            </button>
          </div>

          {/* Discreet Stealth Toggle (Hides all config gear icons so spectators see pure live feed) */}
          <button
            onClick={() => setStealthMode(!stealthMode)}
            className={`p-1.5 rounded border transition-colors ${
              stealthMode 
                ? 'bg-[#333333] border-[#555555] text-[#22C55E]' 
                : 'bg-[#1C1C1C] border-[#2A2A2A] text-[#666666] hover:text-[#AAAAAA]'
            }`}
            title={stealthMode ? "Stealth Mode ON (Settings Hidden)" : "Toggle Stealth Mode"}
          >
            {stealthMode ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
      </div>

      {/* Camera Matrix Canvas Container */}
      <div className="flex-1 p-2 bg-[#0B0B0B] overflow-hidden">
        {/* 2x2 Matrix Layout */}
        {layoutMode === 'grid-2x2' && (
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-2">
            {cameras.map((camera) => (
              <CameraFeedTile
                key={camera.id}
                camera={camera}
                isMaximized={false}
                onToggleMaximize={toggleMaximize}
                onSourceChange={handleSourceChange}
                showAiOverlay={showAiOverlay}
                stealthMode={stealthMode}
                onEventDetected={onAiEvent}
              />
            ))}
          </div>
        )}

        {/* 1+3 Layout (1 large prominent feed + 3 side feeds) */}
        {layoutMode === '1+3' && (
          <div className="w-full h-full flex flex-col lg:flex-row gap-2">
            {/* Primary Large Feed */}
            <div className="flex-[3] h-full">
              {(() => {
                const primaryCam = cameras.find(c => c.id === focusedCameraId) || cameras[0];
                return (
                  <CameraFeedTile
                    key={primaryCam.id}
                    camera={primaryCam}
                    isMaximized={false}
                    onToggleMaximize={toggleMaximize}
                    onSourceChange={handleSourceChange}
                    showAiOverlay={showAiOverlay}
                    stealthMode={stealthMode}
                    onEventDetected={onAiEvent}
                  />
                );
              })()}
            </div>

            {/* 3 Secondary Feeds Stacked on Right */}
            <div className="flex-[1] flex flex-col gap-2 h-full overflow-hidden">
              {cameras
                .filter(c => c.id !== (focusedCameraId || 'CAM-01'))
                .map((camera) => (
                  <div key={camera.id} className="flex-1 min-h-[120px]">
                    <CameraFeedTile
                      camera={camera}
                      isMaximized={false}
                      onToggleMaximize={() => {
                        setFocusedCameraId(camera.id);
                      }}
                      onSourceChange={handleSourceChange}
                      showAiOverlay={showAiOverlay}
                      stealthMode={stealthMode}
                      onEventDetected={onAiEvent}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Focus Mode (Single Large Camera with Bottom Channel Switcher) */}
        {layoutMode === 'focus' && (
          <div className="w-full h-full flex flex-col gap-2">
            <div className="flex-1 w-full h-full">
              {(() => {
                const cam = cameras.find(c => c.id === focusedCameraId) || cameras[0];
                return (
                  <CameraFeedTile
                    key={cam.id}
                    camera={cam}
                    isMaximized={true}
                    onToggleMaximize={toggleMaximize}
                    onSourceChange={handleSourceChange}
                    showAiOverlay={showAiOverlay}
                    stealthMode={stealthMode}
                    onEventDetected={onAiEvent}
                  />
                );
              })()}
            </div>

            {/* Bottom Channel Strip */}
            <div className="flex items-center gap-2 p-1.5 bg-[#141414] border border-[#242424] rounded-md shrink-0 overflow-x-auto">
              {cameras.map((cam) => {
                const isSelected = cam.id === focusedCameraId;
                return (
                  <button
                    key={cam.id}
                    onClick={() => setFocusedCameraId(cam.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all ${
                      isSelected 
                        ? 'bg-[#252525] text-[#22C55E] border border-[#22C55E]/40 font-semibold' 
                        : 'text-[#888888] hover:bg-[#1E1E1E] hover:text-[#CCCCCC] border border-transparent'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#22C55E]' : 'bg-[#555555]'}`} />
                    <span>{cam.id}</span>
                    <span className="text-[10px] text-[#666666] hidden sm:inline">
                      {cam.sector.split('/')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Ticker */}
      <div className="px-4 py-1.5 bg-[#141414] border-t border-[#222222] flex items-center justify-between text-[11px] font-mono text-[#777777]">
        <div className="flex items-center gap-3">
          <span className="text-[#AAAAAA]">INGESTION: RTSP/MJPEG DUAL STREAM</span>
          <span className="hidden md:inline text-[#555555]">|</span>
          <span className="hidden md:inline">CODEC: H.264 / HIGH PROFILE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#22C55E]">LATENCY: ~16ms</span>
        </div>
      </div>
    </div>
  );
}
