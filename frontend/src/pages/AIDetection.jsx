import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Cpu, Activity, Video } from 'lucide-react';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import PlateTag from '../components/plates/PlateTag';

export default function AIDetection() {
  const [videoSource, setVideoSource] = useState('live');
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    platesDetected: 0,
    vehiclesDetected: 0,
  });
  
  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(`ws://${window.location.hostname}:8000/api/ai/ws/events`);
    
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'INFERENCE_EVENT') {
          const data = msg.data;
          
          setEvents(prev => {
            const newEvents = [data, ...prev].slice(0, 50); // Keep last 50
            return newEvents;
          });
          
          setStats(prev => ({
            platesDetected: data.plate_number ? prev.platesDetected + 1 : prev.platesDetected,
            vehiclesDetected: prev.vehiclesDetected + 1
          }));
        }
      } catch (e) {
        console.error("WS Parse error", e);
      }
    };
    
    return () => ws.close();
  }, []);

  return (
    <PageWrapper
      title="Live AI Detection"
      description="Real-time video inference powered by YOLOv8 and EasyOCR"
      actions={
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs font-medium bg-[#1A1A1A] text-[#22C55E] px-3 py-1.5 rounded-full border border-[#22C55E]/20">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            AI ENGINE ONLINE
          </span>
        </div>
      }
    >
      <div className="w-full h-full flex flex-col xl:flex-row gap-6 p-6 overflow-hidden">
        
        {/* Left Side: Video Feed */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 bg-[#161616] border border-[#222222] rounded-lg overflow-hidden flex flex-col relative min-h-[400px] shadow-sm">
            <div className="p-3 border-b border-[#222222] flex justify-between items-center bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <Video size={16} className="text-[#AAAAAA]" />
                <h3 className="text-sm font-semibold text-[#EAEAEA] tracking-wide">Live Video Stream</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#606060]">Source:</span>
                <select 
                  className="bg-[#222222] border border-[#333333] text-xs text-[#F0F0F0] rounded px-2 py-1 outline-none"
                  value={videoSource}
                  onChange={(e) => setVideoSource(e.target.value)}
                >
                  <option value="live">Live AI Stream (Port 5000)</option>
                  <option value="sample">Sample Video (video_testing.mp4)</option>
                </select>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center bg-black relative">
              {videoSource === 'live' ? (
                <>
                  <img 
                    src={`http://${window.location.hostname}:5000/video_feed`} 
                    alt="AI Video Feed" 
                    className="w-full h-full object-contain relative z-10"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#606060] hidden gap-3 z-0">
                    <Video size={48} className="opacity-50" />
                    <p>Waiting for video stream...</p>
                    <p className="text-xs text-center max-w-sm">Ensure the AI Engine is running locally on port 5000.</p>
                  </div>
                </>
              ) : (
                <video 
                  src="/sample_video.mp4" 
                  className="w-full h-full object-contain"
                  autoPlay 
                  loop 
                  muted 
                  controls 
                />
              )}
            </div>
          </div>
          
          {/* Quick Stats below video */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
            {[
              { label: "Vehicles Detected", value: stats.vehiclesDetected, icon: Activity, color: "text-[#E0E0E0]" },
              { label: "Plates Recognized", value: stats.platesDetected, icon: Cpu, color: "text-[#E0E0E0]" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#161616] border border-[#222222] rounded-lg p-5 flex items-center gap-5 shadow-sm">
                <div className={`p-3.5 rounded-md bg-[#222222] border border-[#333333] ${stat.color}`}>
                  <stat.icon size={22} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] text-[#888888] font-medium tracking-wide uppercase">{stat.label}</p>
                  <p className="text-3xl font-semibold text-[#F4F4F4] tracking-tight">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Side: Event Stream */}
        <div className="w-full xl:w-[400px] bg-[#161616] border border-[#222222] rounded-lg overflow-hidden flex flex-col shrink-0 shadow-sm">
          <div className="p-4 border-b border-[#222222] flex justify-between items-center bg-[#1A1A1A]">
            <h3 className="text-sm font-semibold text-[#EAEAEA] tracking-wide">Recent ANPR Events</h3>
            <span className="text-[11px] font-medium bg-[#2A2A2A] px-2.5 py-1 rounded-sm text-[#CCCCCC]">{events.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-0">
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#666666] text-sm p-6 text-center gap-3">
                <Activity size={36} className="opacity-40 mb-1" strokeWidth={1} />
                <p className="font-medium text-[#888888]">No AI events received yet.</p>
                <p className="text-[11px] text-[#555555]">Make sure the AI backend is emitting events to WebSocket.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Plate</TableHead>
                    <TableHead>Class</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((ev, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        {ev.plate_number ? (
                          <PlateTag plateNumber={ev.plate_number} />
                        ) : (
                          <span className="text-xs text-[#606060] italic">No plate</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs capitalize text-[#808080]">
                        {ev.vehicle_class}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
        
      </div>
    </PageWrapper>
  );
}
