import React, { useState } from 'react';
import LiveVideoWall from './routes/LiveVideoWall';
import AnprEvents from './routes/AnprEvents';
import VehicleJourney from './routes/VehicleJourney';
import GisMapStub from './routes/GisMapStub';
import TrafficAnalytics from './routes/TrafficAnalytics';
import AlertTerminal from './routes/AlertTerminal';
import SystemHealth from './routes/SystemHealth';

export default function App() {
  const [activeTab, setActiveTab] = useState('video_wall');

  const tabs = [
    { id: 'video_wall', label: '01. VIDEO WALL' },
    { id: 'anpr_events', label: '02. ANPR & OCR LOG' },
    { id: 'reid_journey', label: '03. REID & JOURNEYS' },
    { id: 'gis_map', label: '04. GIS MAP' },
    { id: 'traffic_analytics', label: '05. TRAFFIC ANALYTICS' },
    { id: 'alerts', label: '06. ALERTS & VIOLATIONS' },
    { id: 'system_health', label: '07. SYSTEM HEALTH' }
  ];

  return (
    <div className="raw-app">
      {/* Raw Header */}
      <header className="raw-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="raw-header-title">
            SIH 2026 // CCTV -&gt; ANPR -&gt; VEHICLE INTELLIGENCE PLATFORM
          </div>
          <div style={{ fontSize: '11px', color: '#555555' }}>
            LOCAL TIME: {new Date().toISOString()}
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="raw-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              [{tab.label}]
            </button>
          ))}
        </nav>
      </header>

      {/* Raw Status Bar */}
      <div className="raw-status-bar">
        <span>STATUS: <b>NORMAL_OPS</b></span>
        <span>CAMERAS: <b>4 ACTIVE</b></span>
        <span>AI WORKERS: <b>YOLOv8 + ByteTrack + PaddleOCR</b></span>
        <span>EVENT BUS: <b>KAFKA (PLAINTEXT:9092)</b></span>
        <span>STORAGE: <b>POSTGIS + REDIS</b></span>
      </div>

      {/* Active Route Content */}
      <main className="raw-main">
        {activeTab === 'video_wall' && <LiveVideoWall />}
        {activeTab === 'anpr_events' && <AnprEvents />}
        {activeTab === 'reid_journey' && <VehicleJourney />}
        {activeTab === 'gis_map' && <GisMapStub />}
        {activeTab === 'traffic_analytics' && <TrafficAnalytics />}
        {activeTab === 'alerts' && <AlertTerminal />}
        {activeTab === 'system_health' && <SystemHealth />}
      </main>
    </div>
  );
}
