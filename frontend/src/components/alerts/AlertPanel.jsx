import React from 'react';
import { useAlerts } from '../../hooks/useAlerts';
import AlertCard from './AlertCard';
import { Bell } from 'lucide-react';

// Demo alerts shown when the backend has no live alerts
const DEMO_ALERTS = [
  {
    id: 'demo-1',
    severity: 'critical',
    type: 'blacklisted_vehicle',
    camera_id: 'CAM-07',
    camera_label: 'Sector 17 – Tribune Chowk',
    plate_number: 'PB10DX4421',
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: 'demo-2',
    severity: 'warning',
    type: 'camera_fault',
    camera_id: 'CAM-23',
    camera_label: 'Sector 35 – ISBT Entry',
    plate_number: null,
    created_at: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: 'demo-3',
    severity: 'warning',
    type: 'wrong_way',
    camera_id: 'CAM-11',
    camera_label: 'Sector 22 – Madhya Marg',
    plate_number: 'HR26BN0093',
    created_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: 'demo-4',
    severity: 'critical',
    type: 'speeding',
    camera_id: 'CAM-03',
    camera_label: 'Sector 9 – Jan Marg',
    plate_number: 'CH01AB7654',
    created_at: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    status: 'active',
  },
];

export default function AlertPanel() {
  const { alerts, activeCount, resolveAlert } = useAlerts(15000);

  const displayAlerts = alerts.length > 0 ? alerts : DEMO_ALERTS;
  const displayCount = alerts.length > 0 ? activeCount : DEMO_ALERTS.length;
  const isDemo = alerts.length === 0;

  return (
    <aside className="w-[280px] h-full flex flex-col bg-[#111111] border-l border-[#1E1E1E] shrink-0 overflow-hidden font-ui">

      {/* ── Header ─────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-2.5">
          <Bell size={14} strokeWidth={1.5} className="text-[#888888]" />
          <h2 className="text-[13px] font-semibold text-[#D0D0D0] tracking-wide uppercase">
            Alerts
          </h2>
        </div>

        <span
          className={
            displayCount > 0
              ? 'px-2 py-0.5 rounded-[3px] text-[10px] font-bold bg-[#2A1010] text-[#EF4444] border border-[#EF4444]/20 font-data'
              : 'px-2 py-0.5 rounded-[3px] text-[10px] font-medium bg-[#1A1A1A] text-[#444444] font-data'
          }
        >
          {displayCount} active
        </span>
      </div>

      {/* ── Cards ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {displayAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onResolve={isDemo ? undefined : resolveAlert}
          />
        ))}
      </div>
    </aside>
  );
}