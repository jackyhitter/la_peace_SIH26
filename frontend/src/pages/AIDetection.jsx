import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Cpu, Activity, Video, Camera, Shield, Radio, Sparkles } from 'lucide-react';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import PlateTag from '../components/plates/PlateTag';
import MultiCameraGrid from '../components/camera/MultiCameraGrid';

export default function AIDetection() {
  const [events, setEvents] = useState([
    {
      timestamp: new Date(Date.now() - 4000).toISOString(),
      camera_id: 'CAM-01',
      plate_number: 'CH01AB1049',
      vehicle_class: 'sedan',
      speed_kmh: 52
    },
    {
      timestamp: new Date(Date.now() - 11000).toISOString(),
      camera_id: 'CAM-02',
      plate_number: 'PB65BC4921',
      vehicle_class: 'suv',
      speed_kmh: 48
    },
    {
      timestamp: new Date(Date.now() - 18000).toISOString(),
      camera_id: 'CAM-03',
      plate_number: 'DL04CD8832',
      vehicle_class: 'truck',
      speed_kmh: 39
    }
  ]);

  const [stats, setStats] = useState({
    platesDetected: 142,
    vehiclesDetected: 189,
    activeFeeds: 4
  });

  // Handle incoming camera detection events (from real WS or multi-camera feeds)
  const handleAiEvent = useCallback((data) => {
    setEvents(prev => {
      const newEvents = [data, ...prev].slice(0, 50); // Keep last 50
      return newEvents;
    });

    setStats(prev => ({
      ...prev,
      platesDetected: data.plate_number ? prev.platesDetected + 1 : prev.platesDetected,
      vehiclesDetected: prev.vehiclesDetected + 1
    }));
  }, []);

  useEffect(() => {
    // Connect to Backend WebSocket
    let ws;
    try {
      ws = new WebSocket(`ws://${window.location.hostname}:8000/api/ai/ws/events`);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'INFERENCE_EVENT') {
            handleAiEvent(msg.data);
          }
        } catch (e) {
          console.error("WS Parse error", e);
        }
      };
    } catch (err) {
      console.warn("WebSocket connection skipped or not running", err);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [handleAiEvent]);

  return (
    <PageWrapper
      title="Live AI Detection & Surveillance Grid"
      description="Multi-channel real-time ANPR inference pipeline powered by YOLOv8 and EasyOCR"
      actions={
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs font-mono font-medium bg-[#1A1A1A] text-[#22C55E] px-3 py-1.5 rounded border border-[#22C55E]/30">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            AI ENGINE ONLINE
          </span>

          <span className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#CCCCCC] bg-[#1A1A1A] px-3 py-1.5 rounded border border-[#333333]">
            <Radio size={13} className="text-[#22C55E]" />
            4 FEEDS SYNCHRONIZED
          </span>
        </div>
      }
    >
      <div className="w-full h-full flex flex-col xl:flex-row gap-5 p-5 overflow-hidden">
        
        {/* Left Side: Multi-Camera Feed Grid & Quick Telemetry */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
          {/* Multi-Camera Surveillance Matrix */}
          <div className="flex-1 min-h-[440px] flex flex-col overflow-hidden">
            <MultiCameraGrid onAiEvent={handleAiEvent} />
          </div>

          {/* Quick Stats below video feeds */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            {[
              { label: "Vehicles Tracked", value: stats.vehiclesDetected, icon: Activity, detail: "Across all sectors" },
              { label: "Plates Recognized", value: stats.platesDetected, icon: Cpu, detail: "High OCR confidence" },
              { label: "Active Channels", value: "4 / 4", icon: Camera, detail: "1080P RTSP Grid" },
              { label: "Inference Latency", value: "~18 ms", icon: Sparkles, detail: "YOLOv8 + EasyOCR" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#161616] border border-[#222222] rounded-md p-3.5 flex items-center gap-3.5 shadow-sm">
                <div className="p-2.5 rounded bg-[#202020] border border-[#2A2A2A] text-[#E0E0E0] shrink-0">
                  <stat.icon size={18} strokeWidth={1.7} />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-[10px] text-[#777777] font-mono tracking-wider uppercase truncate">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold font-data text-[#F4F4F4] tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Real-time ANPR Event Stream */}
        <div className="w-full xl:w-[380px] bg-[#161616] border border-[#222222] rounded-md overflow-hidden flex flex-col shrink-0 shadow-sm h-full">
          <div className="p-3.5 border-b border-[#242424] flex justify-between items-center bg-[#191919]">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-[#22C55E]" />
              <h3 className="text-xs font-mono font-bold tracking-wider text-[#EAEAEA] uppercase">
                Recent ANPR Reads
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#242424] px-2 py-0.5 rounded text-[#22C55E] border border-[#333333]">
              LIVE STREAM
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-0">
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#666666] text-xs p-6 text-center gap-3">
                <Activity size={32} className="opacity-40 mb-1" strokeWidth={1} />
                <p className="font-medium text-[#888888]">Monitoring camera feeds...</p>
                <p className="text-[10px] text-[#555555]">
                  Detections from camera feeds will be indexed here automatically.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Plate</TableHead>
                    <TableHead>Class</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((ev, i) => (
                    <TableRow key={i} className="hover:bg-[#1C1C1C] transition-colors">
                      <TableCell className="text-[11px] font-mono whitespace-nowrap text-[#888888]">
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </TableCell>
                      <TableCell className="text-[10px] font-mono text-[#CCCCCC]">
                        {ev.camera_id || 'CAM-01'}
                      </TableCell>
                      <TableCell>
                        {ev.plate_number ? (
                          <PlateTag plate={ev.plate_number} size="sm" />
                        ) : (
                          <span className="text-[11px] text-[#606060] italic">No plate</span>
                        )}
                      </TableCell>
                      <TableCell className="text-[11px] font-mono uppercase text-[#AAAAAA]">
                        {ev.vehicle_class}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Quick Footer for Events */}
          <div className="p-2.5 bg-[#141414] border-t border-[#222222] flex items-center justify-between text-[10px] font-mono text-[#666666]">
            <span>BUFFER: {events.length}/50 READS</span>
            <span className="text-[#22C55E]">AUTO-COMMITTED TO DB</span>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
