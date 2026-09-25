import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { 
  Cpu, 
  Activity, 
  Video, 
  Camera, 
  Shield, 
  Radio, 
  Sparkles, 
  AlertTriangle, 
  Navigation, 
  CheckCircle2,
  HelpCircle,
  Flame,
  Zap,
  Target
} from 'lucide-react';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import PlateTag from '../components/plates/PlateTag';
import MultiCameraGrid from '../components/camera/MultiCameraGrid';
import FeatureInfoButton from '../components/ui/FeatureInfoModal';

export default function AIDetection() {
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'intelligence' | 'interception'

  const [events, setEvents] = useState([
    {
      timestamp: new Date(Date.now() - 4000).toISOString(),
      camera_id: 'CAM-01',
      plate_number: 'CH01AB1049',
      vehicle_class: 'sedan',
      speed_kmh: 52,
      anomaly: 'cloned_plate',
      anomalyText: 'Impossible Travel: 240 km/h anomaly vs CAM-46'
    },
    {
      timestamp: new Date(Date.now() - 9000).toISOString(),
      camera_id: 'CAM-03',
      plate_number: 'PB10AB1234',
      vehicle_class: 'truck',
      speed_kmh: 44,
      anomaly: 'attribute_mismatch',
      anomalyText: 'Body Mismatch: Detected Red Truck vs RTO White Maruti Swift'
    },
    {
      timestamp: new Date(Date.now() - 15000).toISOString(),
      camera_id: 'CAM-02',
      plate_number: 'PB65BC4921',
      vehicle_class: 'motorcycle',
      speed_kmh: 48,
      anomaly: 'multi_violation',
      anomalyText: 'Traffic Safety: Helmetless Rider & Triple Riding'
    },
    {
      timestamp: new Date(Date.now() - 22000).toISOString(),
      camera_id: 'CAM-04',
      plate_number: 'DL04CD8832',
      vehicle_class: 'sedan',
      speed_kmh: 64,
      anomaly: 'hsrp_classifier',
      anomalyText: 'HSRP Clean Air: EV Green Plate Verified'
    }
  ]);

  const [stats, setStats] = useState({
    platesDetected: 146,
    vehiclesDetected: 194,
    activeFeeds: 4,
    anomaliesCaught: 12
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
      description="Next-generation multi-channel ANPR, forensic anomaly detection, and tactical interception"
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
      <div className="w-full h-full flex flex-col gap-4 p-5 overflow-hidden">
        
        {/* Top Hackathon Innovation Ribbon: Feature Justifications with (i) Buttons */}
        <div className="bg-[#161616] border border-[#262626] rounded-md px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-[#3E7BFA]" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#F0F0F0] uppercase">
              SIH 2026 Core Innovations:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-[#1F1F1F] px-2 py-1 rounded border border-[#2E2E2E]">
              <span className="text-[11px] font-mono text-[#E0E0E0]">Cloned Plate Buster</span>
              <FeatureInfoButton featureId="impossible_travel" label="Why?" />
            </div>

            <div className="flex items-center gap-1 bg-[#1F1F1F] px-2 py-1 rounded border border-[#2E2E2E]">
              <span className="text-[11px] font-mono text-[#E0E0E0]">Attribute Mismatch</span>
              <FeatureInfoButton featureId="attribute_mismatch" label="Why?" />
            </div>

            <div className="flex items-center gap-1 bg-[#1F1F1F] px-2 py-1 rounded border border-[#2E2E2E]">
              <span className="text-[11px] font-mono text-[#E0E0E0]">Bayesian Voting (98.4%)</span>
              <FeatureInfoButton featureId="temporal_consensus" label="Why?" />
            </div>

            <div className="flex items-center gap-1 bg-[#1F1F1F] px-2 py-1 rounded border border-[#2E2E2E]">
              <span className="text-[11px] font-mono text-[#E0E0E0]">Multi-Violation Suite</span>
              <FeatureInfoButton featureId="multi_violation" label="Why?" />
            </div>

            <div className="flex items-center gap-1 bg-[#1F1F1F] px-2 py-1 rounded border border-[#2E2E2E]">
              <span className="text-[11px] font-mono text-[#E0E0E0]">Predictive Interception</span>
              <FeatureInfoButton featureId="predictive_interception" label="Why?" />
            </div>

            <div className="flex items-center gap-1 bg-[#1F1F1F] px-2 py-1 rounded border border-[#2E2E2E]">
              <span className="text-[11px] font-mono text-[#E0E0E0]">HSRP EV Classifier</span>
              <FeatureInfoButton featureId="hsrp_classifier" label="Why?" />
            </div>
          </div>
        </div>

        {/* Main Content Area: Feeds on Left, Intelligence / Events on Right */}
        <div className="flex-1 flex flex-col xl:flex-row gap-4 overflow-hidden min-h-0">
          
          {/* Left Column: Multi-Camera CCTV Surveillance Grid */}
          <div className="flex-1 flex flex-col gap-3 overflow-hidden min-h-0">
            <div className="flex-1 min-h-[420px] flex flex-col overflow-hidden">
              <MultiCameraGrid onAiEvent={handleAiEvent} />
            </div>

            {/* Quick Metrics Ticker */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 shrink-0">
              {[
                { label: "Vehicles Tracked", value: stats.vehiclesDetected, icon: Activity, detail: "Active tracking across matrix" },
                { label: "Plates Recognized", value: stats.platesDetected, icon: Cpu, detail: "Bayesian Multi-frame OCR" },
                { label: "Anomalies Flagged", value: `${stats.anomaliesCaught} Events`, icon: AlertTriangle, detail: "Cloned / Mismatch catches" },
                { label: "Inference Latency", value: "~18 ms", icon: Zap, detail: "YOLOv8 + EasyOCR" }
              ].map((stat, i) => (
                <div key={i} className="bg-[#161616] border border-[#222222] rounded p-3 flex items-center gap-3 shadow-sm">
                  <div className="p-2 rounded bg-[#202020] border border-[#2A2A2A] text-[#E0E0E0] shrink-0">
                    <stat.icon size={16} strokeWidth={1.8} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-[10px] text-[#777777] font-mono uppercase truncate">
                      {stat.label}
                    </p>
                    <p className="text-lg font-bold font-data text-[#F4F4F4] tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Tactical Intelligence & Event Stream */}
          <div className="w-full xl:w-[410px] bg-[#161616] border border-[#222222] rounded-md overflow-hidden flex flex-col shrink-0 shadow-sm h-full">
            
            {/* Tab Header */}
            <div className="p-2 bg-[#191919] border-b border-[#242424] flex items-center justify-between">
              <div className="flex items-center gap-1 bg-[#121212] p-1 rounded border border-[#2A2A2A] w-full">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`flex-1 py-1 px-2 rounded text-[11px] font-mono transition-colors ${
                    activeTab === 'events' 
                      ? 'bg-[#252525] text-[#22C55E] font-semibold' 
                      : 'text-[#888888] hover:text-[#CCCCCC]'
                  }`}
                >
                  Live ANPR Reads
                </button>

                <button
                  onClick={() => setActiveTab('intelligence')}
                  className={`flex-1 py-1 px-2 rounded text-[11px] font-mono transition-colors ${
                    activeTab === 'intelligence' 
                      ? 'bg-[#252525] text-[#3E7BFA] font-semibold' 
                      : 'text-[#888888] hover:text-[#CCCCCC]'
                  }`}
                >
                  Forensic Anomalies
                </button>

                <button
                  onClick={() => setActiveTab('interception')}
                  className={`flex-1 py-1 px-2 rounded text-[11px] font-mono transition-colors ${
                    activeTab === 'interception' 
                      ? 'bg-[#252525] text-[#EF4444] font-semibold' 
                      : 'text-[#888888] hover:text-[#CCCCCC]'
                  }`}
                >
                  Interception Matrix
                </button>
              </div>
            </div>

            {/* TAB 1: Live ANPR Reads */}
            {activeTab === 'events' && (
              <div className="flex-1 overflow-y-auto p-0">
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
              </div>
            )}

            {/* TAB 2: Forensic Anomalies (Cloned Plate + Attribute Mismatch + Violations) */}
            {activeTab === 'intelligence' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                
                {/* Impossible Travel Cloned Plate Alert */}
                <div className="p-3 bg-[#1C1313] border border-[#EF4444]/40 rounded-md">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#EF4444]/20">
                    <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#EF4444]">
                      <AlertTriangle size={14} />
                      CLONED PLATE ANOMALY
                    </span>
                    <FeatureInfoButton featureId="impossible_travel" label="Justification" />
                  </div>
                  <div className="space-y-1 text-[11px] font-mono">
                    <p className="text-[#F0F0F0] font-semibold">Plate: CH01AB1049 (Simultaneous Presence)</p>
                    <p className="text-[#888888]">Spotted at CAM-01 (Capitol) and CAM-46 (IT Park) in 120s.</p>
                    <div className="mt-2 p-1.5 bg-black/60 rounded text-[10px] text-[#EF4444] border border-[#EF4444]/20">
                      Calculated Speed: 270 km/h (Physically Impossible in City Traffic)
                    </div>
                  </div>
                </div>

                {/* Attribute Mismatch Alert */}
                <div className="p-3 bg-[#1D1710] border border-[#F59E0B]/40 rounded-md">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#F59E0B]/20">
                    <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#F59E0B]">
                      <Shield size={14} />
                      VEHICLE ATTRIBUTE MISMATCH
                    </span>
                    <FeatureInfoButton featureId="attribute_mismatch" label="Justification" />
                  </div>
                  <div className="space-y-1 text-[11px] font-mono">
                    <p className="text-[#F0F0F0] font-semibold">Plate: PB10AB1234 (Potential Stolen Plate Swap)</p>
                    <div className="grid grid-cols-2 gap-2 mt-1.5 p-1.5 bg-black/60 rounded text-[10px]">
                      <div>
                        <span className="text-[#888888]">AI Model Vision:</span>
                        <p className="text-[#F59E0B] font-bold">RED TRUCK</p>
                      </div>
                      <div>
                        <span className="text-[#888888]">RTO Database Record:</span>
                        <p className="text-[#22C55E] font-bold">WHITE MARUTI SWIFT</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Multi-Violation Safety Alert */}
                <div className="p-3 bg-[#131B16] border border-[#22C55E]/40 rounded-md">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#22C55E]/20">
                    <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#22C55E]">
                      <Activity size={14} />
                      BEHAVIORAL VIOLATION DETECTED
                    </span>
                    <FeatureInfoButton featureId="multi_violation" label="Justification" />
                  </div>
                  <div className="space-y-1 text-[11px] font-mono">
                    <p className="text-[#F0F0F0] font-semibold">Camera: CAM-02 (Boulevard Rd)</p>
                    <p className="text-[#AAAAAA]">Two-Wheeler: 3 Passengers (Triple Riding) + Helmetless</p>
                    <span className="inline-block mt-1 text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/20">
                      e-Challan Evidentiary Packet Auto-Queued
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: Predictive Interception Matrix */}
            {activeTab === 'interception' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#2A2A2A]">
                  <span className="text-xs font-bold text-[#F0F0F0] flex items-center gap-1.5">
                    <Target size={14} className="text-[#EF4444]" />
                    ACTIVE TACTICAL INTERCEPTION
                  </span>
                  <FeatureInfoButton featureId="predictive_interception" label="Justification" />
                </div>

                <div className="p-3 bg-[#161616] border border-[#2A2A2A] rounded space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#888888]">Target Vehicle:</span>
                    <span className="text-[#EF4444] font-bold">PB10AB1234 (Blacklisted)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#888888]">Current Trajectory:</span>
                    <span className="text-[#F0F0F0]">East on Madhya Marg @ 58 km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#888888]">Last Sighted:</span>
                    <span className="text-[#22C55E]">CAM-07 (Sector 7 Crossing)</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-[11px] font-bold text-[#888888] uppercase">
                    Downstream Checkpoint ETAs:
                  </p>

                  <div className="p-2.5 bg-[#1C1C1C] border border-[#2E2E2E] rounded flex items-center justify-between">
                    <div>
                      <p className="text-[#F0F0F0] font-semibold">CAM-08 (Sector 8 Junction)</p>
                      <p className="text-[10px] text-[#777777]">Distance: 1.4 km ahead</p>
                    </div>
                    <span className="text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-1 rounded border border-[#F59E0B]/30">
                      ETA: 1m 24s
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#201515] border border-[#EF4444]/40 rounded flex items-center justify-between">
                    <div>
                      <p className="text-[#F0F0F0] font-semibold">CAM-27 (Transport Chowk)</p>
                      <p className="text-[10px] text-[#777777]">Recommended Barricade Point</p>
                    </div>
                    <span className="text-xs font-bold text-[#EF4444] bg-[#EF4444]/15 px-2 py-1 rounded border border-[#EF4444]/30">
                      ETA: 3m 10s
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#151C24] border border-[#3E7BFA]/40 rounded text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[#3E7BFA] font-bold">
                    <Navigation size={13} />
                    <span>Automated Tactical Dispatch:</span>
                  </div>
                  <p className="text-[11px] text-[#CCCCCC]">
                    PCR Van #14 (Sector 19) dispatched to lock exit slip road before Transport Chowk flyover.
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-2.5 bg-[#141414] border-t border-[#222222] flex items-center justify-between text-[10px] font-mono text-[#666666]">
              <span>ANPR INTELLIGENCE SUITE</span>
              <span className="text-[#22C55E]">SIH 2026 EDITION</span>
            </div>

          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
