import React from 'react';
import { useAlerts } from '../../hooks/useAlerts';
import AlertCard from './AlertCard';
import { Bell } from 'lucide-react';

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
    <div className="w-full h-full flex flex-col bg-[#161616] font-ui">
      {/* ── Header ─────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#2A2A2A] bg-[#1A1A1A] shrink-0">
        <div className="flex items-center gap-2">
          <Bell size={14} strokeWidth={2} className="text-[#888888]" />
          <h2 className="text-[14px] font-semibold text-[#F0F0F0] tracking-wider uppercase">
            Active Alerts
          </h2>
        </div>
        <span
          className={
            displayCount > 0
              ? 'px-2 py-0.5 rounded-[3px] text-[11px] font-bold bg-[#2A1010] text-[#EF4444] border border-[#EF4444]/20 font-data'
              : 'px-2 py-0.5 rounded-[3px] text-[11px] font-medium bg-[#1E1E1E] text-[#888888] font-data'
          }
        >
          {displayCount} OPEN
        </span>
      </div>

      {/* ── List ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col divide-y divide-[#2A2A2A]">
          {displayAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onResolve={isDemo ? undefined : resolveAlert}
            />
          ))}
        </div>
      </div>
    </div>
  );
}