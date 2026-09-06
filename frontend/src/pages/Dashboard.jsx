import React from 'react';
import MainMap from '../components/map/MainMap';
import AlertPanel from '../components/alerts/AlertPanel';

export default function Dashboard() {
  return (
    <div className="w-full h-full flex overflow-hidden bg-[#111111]">
      {/* Primary Map View with Deck.gl and Minimap */}
      <div className="flex-1 relative h-full">
        <MainMap />
      </div>

      {/* Right Alerts & Recent Reads Panel */}
      <AlertPanel />
    </div>
  );
}
