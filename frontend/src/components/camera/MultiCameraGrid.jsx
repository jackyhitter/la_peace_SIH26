import React, { useState, useCallback } from 'react';
import { 
  Grid, 
  Maximize2, 
  Columns, 
  Radio, 
  Eye, 
  EyeOff, 
  Cpu, 
  Sparkles
} from 'lucide-react';
import CameraFeedTile from './CameraFeedTile';

export default function MultiCameraGrid({ onAiEvent }) {
  // 4 Realistic ANPR Camera Feeds staggered to display distinct vehicles and city locations
  const [cameras, setCameras] = useState([
    {
      id: 'CAM-01',
      name: 'CAM-01 [JAN MARG / CAPITOL]',
      sector: 'Sector 1 / Jan Marg',
      url: '/sample_video.mp4',
      type: 'sample',
      isLiveAI: false,
      fps: '30.0',
      resolution: '1080P FHD',
      initialTime: 15.2, // Peugeot Boxer Van (LR09 FSL)
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
      initialTime: 6.2, // Audi RS5 Coupe (EA61 EVG)
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
      initialTime: 3.5, // BMW 5-Series Saloon (WV54 LUT)
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
      initialTime: 0.5, // Ford Transit Connect (AW15 AVR)
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
    <div className="w-full h-full flex flex-col bg-[#0F0F0F] border border-[#222222] rounded overflow-hidden shadow-sm min-h-0">
      
      {/* CCTV Operations Command Bar */}
      <div className="px-3 py-1.5 bg-[#171717] border-b border-[#242424] flex items-center justify-between gap-2 shrink-0">
        {/* Left: Matrix Title & Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Radio size={13} className="text-[#22C55E] animate-pulse" />
            <h3 className="text-[11px] font-mono font-bold tracking-wider text-[#F0F0F0] uppercase">
              CCTV MATRIX
            </h3>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono text-[#888888] bg-[#1E1E1E] px-2 py-0.5 rounded border border-[#2A2A2A]">
            <span className="w-1 h-1 rounded-full bg-[#22C55E]" />
            4/4 CHANNELS ACTIVE
          </span>
        </div>

        {/* Right: Layout Switcher, AI Overlay Toggle & Stealth Mode */}
        <div className="flex items-center gap-1.5">
          {/* AI Vision HUD Toggle */}
          <button
            type="button"
            onClick={() => setShowAiOverlay(!showAiOverlay)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all border ${
              showAiOverlay 
                ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]' 
                : 'bg-[#1C1C1C] border-[#2A2A2A] text-[#777777] hover:text-[#CCCCCC]'
            }`}
            title="Toggle AI Detection Bounding Boxes & Plates HUD"
          >
            <Cpu size={11} />
            <span>AI HUD: {showAiOverlay ? 'ON' : 'OFF'}</span>
          </button>

          {/* Layout Controls */}
          <div className="flex items-center bg-[#1C1C1C] p-0.5 rounded border border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setLayoutMode('grid-2x2')}
              className={`p-1 rounded text-[10px] transition-colors ${
                layoutMode === 'grid-2x2' 
                  ? 'bg-[#2B2B2B] text-[#F0F0F0]' 
                  : 'text-[#777777] hover:text-[#CCCCCC]'
              }`}
              title="2x2 Grid View"
            >
              <Grid size={12} />
            </button>

            <button
              type="button"
              onClick={() => setLayoutMode('1+3')}
              className={`p-1 rounded text-[10px] transition-colors ${
                layoutMode === '1+3' 
                  ? 'bg-[#2B2B2B] text-[#F0F0F0]' 
                  : 'text-[#777777] hover:text-[#CCCCCC]'
              }`}
              title="1 Main + 3 Thumbnails"
            >
              <Columns size={12} />
            </button>

            <button
              type="button"
              onClick={() => {
                setLayoutMode('focus');
                if (!focusedCameraId) setFocusedCameraId('CAM-01');
              }}
              className={`p-1 rounded text-[10px] transition-colors ${
                layoutMode === 'focus' 
                  ? 'bg-[#2B2B2B] text-[#F0F0F0]' 
                  : 'text-[#777777] hover:text-[#CCCCCC]'
              }`}
              title="Single Focused Camera"
            >
              <Maximize2 size={12} />
            </button>
          </div>

          {/* Stealth Mode */}
          <button
            type="button"
            onClick={() => setStealthMode(!stealthMode)}
            className={`p-1 rounded border transition-colors ${
              stealthMode 
                ? 'bg-[#333333] border-[#555555] text-[#22C55E]' 
                : 'bg-[#1C1C1C] border-[#2A2A2A] text-[#666666] hover:text-[#AAAAAA]'
            }`}
            title={stealthMode ? "Stealth Mode ON" : "Toggle Stealth Mode"}
          >
            {stealthMode ? <EyeOff size={11} /> : <Eye size={11} />}
          </button>
        </div>
      </div>

      {/* Camera Matrix Canvas Container: Strictly locked height */}
      <div className="flex-1 p-1.5 bg-[#080808] overflow-hidden min-h-0">
        
        {/* 2x2 Matrix Layout */}
        {layoutMode === 'grid-2x2' && (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1.5 min-h-0 overflow-hidden">
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
          <div className="w-full h-full flex gap-1.5 min-h-0 overflow-hidden">
            {/* Primary Large Feed */}
            <div className="flex-[3] h-full min-h-0 overflow-hidden">
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
            <div className="flex-[1] flex flex-col gap-1.5 h-full min-h-0 overflow-hidden">
              {cameras
                .filter(c => c.id !== (focusedCameraId || 'CAM-01'))
                .map((camera) => (
                  <div key={camera.id} className="flex-1 min-h-0 overflow-hidden">
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
          <div className="w-full h-full flex flex-col gap-1.5 min-h-0 overflow-hidden">
            <div className="flex-1 w-full h-full min-h-0 overflow-hidden">
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
            <div className="flex items-center gap-1.5 p-1 bg-[#141414] border border-[#242424] rounded shrink-0 overflow-x-auto">
              {cameras.map((cam) => {
                const isSelected = cam.id === focusedCameraId;
                return (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => setFocusedCameraId(cam.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                      isSelected 
                        ? 'bg-[#252525] text-[#22C55E] border border-[#22C55E]/40 font-semibold' 
                        : 'text-[#888888] hover:bg-[#1E1E1E] hover:text-[#CCCCCC] border border-transparent'
                    }`}
                  >
                    <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-[#22C55E]' : 'bg-[#555555]'}`} />
                    <span>{cam.id}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Ticker */}
      <div className="px-3 py-1 bg-[#141414] border-t border-[#222222] flex items-center justify-between text-[10px] font-mono text-[#777777] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[#AAAAAA]">RTSP/MJPEG STREAM</span>
          <span>|</span>
          <span>CODEC: H.264</span>
        </div>
        <span className="text-[#22C55E]">LATENCY: ~16ms</span>
      </div>
    </div>
  );
}
