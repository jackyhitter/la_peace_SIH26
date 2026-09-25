import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Table, TableHead, TableHeader, TableBody } from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';
import { ScrollText, Filter } from 'lucide-react';
import { formatTimeOnly } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';

// Simulated initial audit events
const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    timestamp: new Date(Date.now() - 5000).toISOString(),
    actor: 'Admin',
    event: 'BLACKLIST MATCH',
    entity: 'PB10AB1234 (CAM-07)',
    action: 'Alert Generated'
  },
  {
    id: 'evt-2',
    timestamp: new Date(Date.now() - 14000).toISOString(),
    actor: 'System',
    event: 'CAMERA STATUS',
    entity: 'CAM-12',
    action: 'Changed to OFFLINE'
  },
  {
    id: 'evt-3',
    timestamp: new Date(Date.now() - 45000).toISOString(),
    actor: 'Operator',
    event: 'ALERT RESOLVED',
    entity: 'Alert #1842',
    action: 'Marked as False Positive'
  },
  {
    id: 'evt-4',
    timestamp: new Date(Date.now() - 86000).toISOString(),
    actor: 'Chief Controller',
    event: 'WATCHLIST UPDATED',
    entity: 'HR26BN0093',
    action: 'Added to Watchlist'
  }
];

export default function Logs() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [filter, setFilter] = useState('all');

  // Listen for custom events dispatched on the window object (centralized event bus simulation)
  useEffect(() => {
    const handleAuditLog = (e) => {
      const newEvent = {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: e.detail.actor || 'System',
        event: e.detail.event || 'SYSTEM EVENT',
        entity: e.detail.entity || 'Unknown',
        action: e.detail.action || 'Logged'
      };
      setEvents((prev) => [newEvent, ...prev].slice(0, 100)); // Keep last 100
    };

    window.addEventListener('AUDIT_LOG_EVENT', handleAuditLog);
    
    // Simulate some live events arriving randomly
    const simInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        window.dispatchEvent(new CustomEvent('AUDIT_LOG_EVENT', {
          detail: {
            actor: 'System',
            event: 'VEHICLE DETECTED',
            entity: `CAM-${Math.floor(Math.random() * 46 + 1).toString().padStart(2, '0')}`,
            action: 'Trajectory Updated'
          }
        }));
      }
    }, 8000);

    return () => {
      window.removeEventListener('AUDIT_LOG_EVENT', handleAuditLog);
      clearInterval(simInterval);
    };
  }, []);

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.event.includes(filter));

  return (
    <PageWrapper
      title="Live Audit Log"
      subtitle="Real-time chronological audit trail of all system and operator actions"
      fullWidth
      actions={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[12px] text-[#888888] font-ui">
            <Filter size={13} strokeWidth={1.5} />
            <span>Event Type:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#242424] border border-[#2A2A2A] rounded px-2 py-1 text-[#F0F0F0] focus:outline-none focus:border-[#3D3D3D]"
            >
              <option value="all">All Events</option>
              <option value="BLACKLIST">Blacklist</option>
              <option value="ALERT">Alerts</option>
              <option value="CAMERA">Cameras</option>
              <option value="WATCHLIST">Watchlist</option>
            </select>
          </div>
        </div>
      }
    >
      <div className="border border-[#2A2A2A] rounded-[6px] overflow-hidden bg-[#161616]">
        <Table>
          <TableHead>
            <tr>
              <TableHeader mono>TIME</TableHeader>
              <TableHeader>ACTOR</TableHeader>
              <TableHeader>EVENT</TableHeader>
              <TableHeader>ENTITY</TableHeader>
              <TableHeader>ACTION</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((evt) => (
                <tr key={evt.id} className="border-b border-[#2A2A2A] hover:bg-[#1E1E1E] transition-colors">
                  <td className="px-4 py-3 text-[12px] text-[#888888] font-data whitespace-nowrap">
                    {formatTimeOnly(evt.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#DEDEDE] font-ui whitespace-nowrap">
                    {evt.actor}
                  </td>
                  <td className="px-4 py-3 text-[12px] font-bold text-[#F0F0F0] font-ui whitespace-nowrap">
                    {evt.event}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#DEDEDE] font-ui font-medium">
                    {evt.entity}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#888888] font-ui">
                    {evt.action}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8">
                  <EmptyState
                    icon={ScrollText}
                    title="No audit events found"
                    description="No events match the selected filter."
                  />
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </PageWrapper>
  );
}
