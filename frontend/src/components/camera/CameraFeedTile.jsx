import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Upload, 
  Settings, 
  Radio, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Sliders, 
  Check, 
  Video, 
  Cpu, 
  Sparkles,
  Camera,
  Play,
  Pause
} from 'lucide-react';

export default function CameraFeedTile({
  camera,
  isMaximized,
  onToggleMaximize,
  onSourceChange,
  showAiOverlay = true,
  stealthMode = false,
  onEventDetected
}) {
  const [showConfig, setShowConfig] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropFeedback, setDropFeedback] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeBoxes, setActiveBoxes] = useState([]);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [streamError, setStreamError] = useState(false);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const configRef = useRef(null);

  // Real-time ticking timestamp down to milliseconds (gives authentic CCTV live look)
  useEffect(() => {
    let animFrame;
    const updateTime = () => {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const da = String(now.getDate()).padStart(2, '0');
      const hr = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      const se = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setCurrentTimeStr(`${yr}-${mo}-${da} ${hr}:${mi}:${se}.${ms}`);
      animFrame = requestAnimationFrame(updateTime);
    };
    animFrame = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Close config panel on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (configRef.current && !configRef.current.contains(e.target)) {
        setShowConfig(false);
      }
    };
    if (showConfig) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showConfig]);

  // AI simulated detection bounding boxes that move realistically across the screen
  useEffect(() => {
    if (!showAiOverlay) {
      setActiveBoxes([]);
      return;
    }

    const interval = setInterval(() => {
      // Generate 1-3 dynamic bounding boxes simulating YOLOv8 vehicle detection & ANPR
      const vehicleClasses = ['SEDAN', 'SUV', 'TRUCK', 'HATCHBACK'];
      const plates = ['CH01AB1049', 'PB65BC4921', 'DL04CD8832', 'HR26DQ5510', 'MH12PK3918'];
      
      const count = Math.random() > 0.4 ? (Math.random() > 0.7 ? 2 : 1) : 0;
      const newBoxes = [];

      for (let i = 0; i < count; i++) {
        const top = 30 + Math.floor(Math.random() * 40);
        const left = 20 + Math.floor(Math.random() * 50);
        const width = 18 + Math.floor(Math.random() * 15);
        const height = 15 + Math.floor(Math.random() * 15);
        const conf = (0.91 + Math.random() * 0.08).toFixed(2);
        const vClass = vehicleClasses[Math.floor(Math.random() * vehicleClasses.length)];
        const plate = plates[Math.floor(Math.random() * plates.length)];
        const speed = 40 + Math.floor(Math.random() * 35);

        newBoxes.push({
          id: `${camera.id}-${Date.now()}-${i}`,
          top: `${top}%`,
          left: `${left}%`,
          width: `${width}%`,
          height: `${height}%`,
          conf,
          vClass,
          plate,
          speed
        });

        // Trigger telemetry event to parent occasionally
        if (onEventDetected && Math.random() > 0.6) {
          onEventDetected({
            timestamp: new Date().toISOString(),
            camera_id: camera.id,
            plate_number: plate,
            vehicle_class: vClass.toLowerCase(),
            confidence: parseFloat(conf),
            speed_kmh: speed
          });
        }
      }

      setActiveBoxes(newBoxes);
    }, 3200);

    return () => clearInterval(interval);
  }, [showAiOverlay, camera.id, onEventDetected]);

  // Handle dropped video file directly onto the camera tile or inside the config dropzone
  const handleDropVideo = (file) => {
    if (!file || !file.type.startsWith('video/')) {
      alert('Please drop a valid video file (.mp4, .webm, .mov, etc.)');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    onSourceChange(camera.id, {
      type: 'dropped_video',
      url: objectUrl,
      fileName: file.name,
      isLiveAI: false
    });

    setDropFeedback(`Feed Stream Bound: ${file.name}`);
    setTimeout(() => setDropFeedback(null), 3500);
    setShowConfig(false);
  };

  const handleTileDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleTileDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleTileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleDropVideo(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleDropVideo(e.target.files[0]);
    }
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  return (
    <div
      onDragOver={handleTileDragOver}
      onDragLeave={handleTileDragLeave}
      onDrop={handleTileDrop}
      className={`group relative flex flex-col bg-[#0D0D0D] border border-[#262626] rounded-md overflow-hidden transition-all duration-200 select-none shadow-md ${
        isMaximized ? 'w-full h-full' : 'h-full'
      } ${isDragOver ? 'ring-2 ring-[#22C55E] border-transparent' : 'hover:border-[#3A3A3A]'}`}
    >
      {/* Hidden File Input for stealth drop/select */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Top CCTV Overlay Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-2.5 py-1.5 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* Live / REC blinking indicator */}
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#F0F0F0]">REC</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span className="text-[10px] font-mono font-semibold tracking-wider text-[#22C55E]">LIVE</span>
          </div>

          <span className="text-[11px] font-mono font-semibold text-[#EAEAEA] drop-shadow-md">
            {camera.name}
          </span>
        </div>

        {/* Top-Right Control Buttons & Tiny Stealth Config Tab */}
        <div className="flex items-center gap-1">
          {/* Camera Bitrate / FPS Telemetry (Looks 100% genuine) */}
          <span className="hidden sm:inline-block text-[10px] font-mono text-[#8E8E8E] bg-black/50 px-1.5 py-0.5 rounded border border-white/5">
            {camera.fps || '29.97'} FPS · {camera.resolution || '1080P'}
          </span>

          {/* TINY STEALTH CONTROL TAB (Discreet camera diagnostic / stream binding) */}
          {!stealthMode && (
            <div className="relative" ref={configRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfig(!showConfig);
                }}
                title="Camera Sensor Channel Config"
                className={`p-1 rounded text-[#AAAAAA] hover:text-[#FFFFFF] hover:bg-white/15 transition-colors border ${
                  showConfig 
                    ? 'bg-[#222222] border-[#22C55E]/60 text-[#22C55E]' 
                    : 'bg-black/50 border-white/10'
                }`}
              >
                <Settings size={13} strokeWidth={1.8} />
              </button>

              {/* Stealth Popover Menu */}
              {showConfig && (
                <div 
                  className="absolute right-0 top-7 z-50 w-72 p-3 bg-[#151515] border border-[#333333] rounded-md shadow-2xl font-sans text-left text-xs backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2A2A2A]">
                    <div className="flex items-center gap-1.5 text-[#F0F0F0] font-medium">
                      <Radio size={13} className="text-[#22C55E]" />
                      <span>Channel Feed [{camera.id}]</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#888888] bg-[#222222] px-1.5 py-0.5 rounded">
                      RTSP SENSOR
                    </span>
                  </div>

                  {/* Stealth Video Drag & Drop Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group/drop flex flex-col items-center justify-center p-3.5 mb-2.5 border border-dashed border-[#444444] hover:border-[#22C55E] bg-[#1A1A1A] hover:bg-[#202020] rounded cursor-pointer transition-all text-center"
                  >
                    <Upload size={18} className="text-[#888888] group-hover/drop:text-[#22C55E] mb-1.5 transition-colors" />
                    <span className="text-[11px] font-medium text-[#E0E0E0]">
                      Drop Video File Here
                    </span>
                    <span className="text-[9px] text-[#777777] mt-0.5">
                      or click to browse (.mp4, .webm)
                    </span>
                  </div>

                  {/* Feed Source Options */}
                  <div className="space-y-1 text-[11px]">
                    <p className="text-[10px] uppercase font-mono text-[#777777] mb-1">
                      Signal Presets:
                    </p>

                    <button
                      onClick={() => {
                        onSourceChange(camera.id, {
                          type: 'live_ai',
                          url: `http://${window.location.hostname}:5000/video_feed`,
                          isLiveAI: true,
                          fileName: 'AI Engine Stream (Port 5000)'
                        });
                        setShowConfig(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between ${
                        camera.isLiveAI 
                          ? 'bg-[#22C55E]/15 text-[#22C55E] font-medium' 
                          : 'text-[#BBBBBB] hover:bg-[#222222]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Cpu size={12} />
                        Live AI Stream (:5000)
                      </span>
                      {camera.isLiveAI && <Check size={12} />}
                    </button>

                    <button
                      onClick={() => {
                        onSourceChange(camera.id, {
                          type: 'sample',
                          url: '/sample_video.mp4',
                          isLiveAI: false,
                          fileName: 'Sample Video'
                        });
                        setShowConfig(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between ${
                        !camera.isLiveAI && camera.type === 'sample' 
                          ? 'bg-[#22C55E]/15 text-[#22C55E] font-medium' 
                          : 'text-[#BBBBBB] hover:bg-[#222222]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Video size={12} />
                        Corridor Sample Video
                      </span>
                      {!camera.isLiveAI && camera.type === 'sample' && <Check size={12} />}
                    </button>

                    {camera.fileName && (
                      <div className="pt-2 mt-2 border-t border-[#262626] text-[10px] text-[#888888] flex items-center justify-between">
                        <span className="truncate max-w-[170px]" title={camera.fileName}>
                          File: {camera.fileName}
                        </span>
                        <span className="text-[#22C55E]">Loaded</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Maximize / Minimize Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaximize(camera.id);
            }}
            title={isMaximized ? "Restore Grid View" : "Maximize Feed"}
            className="p-1 rounded text-[#AAAAAA] hover:text-[#FFFFFF] bg-black/50 hover:bg-white/15 border border-white/10 transition-colors"
          >
            {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div 
        className="relative flex-1 w-full h-full bg-black flex items-center justify-center overflow-hidden cursor-pointer"
        onDoubleClick={() => onToggleMaximize(camera.id)}
      >
        {/* Stream Rendering: Live AI MJPEG img or HTML5 looped video */}
        {camera.isLiveAI ? (
          <>
            <img
              src={camera.url}
              alt={camera.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${streamError ? 'hidden' : 'block'}`}
              onError={() => setStreamError(true)}
              onLoad={() => setStreamError(false)}
            />
            {streamError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111111] text-[#777777] p-4 text-center">
                <Video size={32} className="opacity-40 mb-2" />
                <span className="text-xs font-mono text-[#AAAAAA]">SIGNAL LOSS / PORT 5000 STANDBY</span>
                <span className="text-[10px] text-[#666666] mt-1 max-w-xs">
                  Drop a video file here to simulate live feed playback
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-3 px-3 py-1 bg-[#222222] hover:bg-[#333333] text-xs text-[#E0E0E0] rounded border border-[#444444] transition-colors"
                >
                  Ingest Video Feed
                </button>
              </div>
            )}
          </>
        ) : (
          <video
            ref={videoRef}
            src={camera.url}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            controls={false} // Hidden controls so spectators think it's a live camera!
          />
        )}

        {/* Real-time Dynamic AI Bounding Boxes HUD Overlay */}
        {showAiOverlay && activeBoxes.map((box) => (
          <div
            key={box.id}
            style={{
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
            }}
            className="absolute border border-[#22C55E]/90 bg-[#22C55E]/10 pointer-events-none transition-all duration-700 ease-out z-10"
          >
            {/* Target Reticle Corners */}
            <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#22C55E]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#22C55E]" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#22C55E]" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-[#22C55E]" />

            {/* AI Classification & Plate Badge */}
            <div className="absolute -top-5 left-0 flex items-center gap-1 bg-black/80 px-1 py-0.5 rounded border border-[#22C55E]/50 text-[9px] font-mono text-[#22C55E] whitespace-nowrap shadow-sm">
              <span className="font-semibold">{box.vClass}</span>
              <span className="text-[#AAAAAA]">{box.conf}</span>
              <span className="bg-[#22C55E] text-black px-1 font-bold rounded-[2px]">{box.plate}</span>
            </div>
          </div>
        ))}

        {/* Center Optical Reticle Crosshairs */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
          <div className="w-8 h-[1px] bg-white" />
          <div className="h-8 w-[1px] bg-white absolute" />
        </div>

        {/* Direct Drag Over Highlight Notice */}
        {isDragOver && (
          <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-sm border-2 border-dashed border-[#22C55E] flex flex-col items-center justify-center p-4 text-center">
            <Upload size={36} className="text-[#22C55E] animate-bounce mb-2" />
            <span className="text-sm font-mono font-bold text-[#F0F0F0]">
              DIRECT STREAM INGESTION
            </span>
            <span className="text-xs text-[#22C55E] font-mono mt-1">
              Release to bind video to {camera.id}
            </span>
          </div>
        )}

        {/* Drop Confirmation Toast */}
        {dropFeedback && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 bg-[#161616]/95 border border-[#22C55E]/80 text-[#22C55E] px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 shadow-xl animate-fade-in">
            <Check size={14} />
            <span>{dropFeedback}</span>
          </div>
        )}
      </div>

      {/* Bottom CCTV Telemetry & Timestamp Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-2.5 py-1.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#CCCCCC] drop-shadow">
          <span className="text-[#22C55E] font-semibold">{currentTimeStr}</span>
          <span className="text-[#777777]">|</span>
          <span className="text-[#AAAAAA]">{camera.sector}</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-[#888888] drop-shadow">
          <span>{camera.id}</span>
          <span className="text-[#22C55E] bg-black/60 px-1 rounded border border-[#22C55E]/30 text-[9px]">
            AI PASS 1
          </span>
        </div>
      </div>
    </div>
  );
}
