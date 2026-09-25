import React from 'react';
import { formatISTTime } from '../../lib/utils';
import ConfidencePill from './ConfidencePill';

export default function VehicleTimeline({ events }) {
  if (!events || events.length === 0) return null;

  // Sort events from oldest to newest for a top-down chronological timeline
  const sortedEvents = [...events].sort((a, b) => new Date(a.event_time) - new Date(b.event_time));

  return (
    <div className="bg-[#161616] border border-[#2A2A2A] rounded-[6px] p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[14px] font-semibold text-[#F0F0F0] font-ui uppercase tracking-wider">
            Sighting Timeline (24h)
          </h3>
          <p className="text-[12px] text-[#888888] font-ui mt-1">
            Chronological path of vehicle across network
          </p>
        </div>
        <span className="text-[11px] font-data text-[#888888] bg-[#1E1E1E] border border-[#2A2A2A] px-2 py-0.5 rounded-[3px]">
          {events.length} Sightings
        </span>
      </div>

      <div className="relative pl-6 space-y-6">
        {/* Continuous vertical line */}
        <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-[#2A2A2A]" />

        {sortedEvents.map((ev, i) => (
          <div key={ev.id} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#111111] border-2 border-[#3E7BFA] shadow-[0_0_8px_rgba(62,123,250,0.4)] z-10" />
            
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[6px] p-3 hover:bg-[#1E1E1E] transition-colors group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-[#F0F0F0] font-ui mb-0.5">
                    {ev.camera_label || `Camera ${ev.camera_id}`}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-ui">
                    <span className="text-[#3E7BFA] font-data">{ev.camera_id}</span>
                    <span className="text-[#555555]">·</span>
                    <span className="text-[#888888]">{ev.sector || 'Unknown Sector'}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[12px] text-[#888888] font-data">
                    {formatISTTime(ev.event_time, true)}
                  </span>
                  <ConfidencePill confidence={ev.confidence} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
