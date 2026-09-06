import React, { useState } from 'react';
import { cn, formatTimeOnly } from '../../lib/utils';
import PlateTag from '../plates/PlateTag';

export default function AlertCard({ alert, onResolve }) {
  const [isResolving, setIsResolving] = useState(false);
  const isCritical = alert.severity?.toLowerCase() === 'critical';

  const formatAlertType = (type) => {
    switch (type) {
      case 'blacklisted_vehicle': return 'Blacklisted Vehicle';
      case 'camera_fault': return 'Camera Offline';
      case 'wrong_way': return 'Wrong-Way Transit';
      case 'speeding': return 'Speed Violation';
      default: return type?.replace(/_/g, ' ') || 'Alert';
    }
  };

  const handleResolve = async (e) => {
    e.stopPropagation();
    setIsResolving(true);
    if (onResolve) await onResolve(alert.id);
  };

  return (
    <div
      className={cn(
        // Card surface: #1C1C1C gives clear separation from #111111 panel (17 lightness delta)
        // Reduced to px-4 py-4 (16px) — large enough to breathe, not so much it feels hollow
        'relative rounded-[5px] px-4 py-4 transition-all duration-200',
        'bg-[#1C1C1C] border border-[#272727]',
        // Left border is the ONLY colour accent — no coloured badge/text competing with it
        'border-l-[3px]',
        isCritical ? 'border-l-[#EF4444]' : 'border-l-[#F59E0B]',
        isResolving && 'opacity-30 pointer-events-none'
      )}
    >
      {/* ── Row 1: severity label + timestamp ── */}
      {/* justify-between kept but severity text is now muted (80% opacity) so it
          doesn't fight with the title below. Bullet removed — left border already signals. */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className={cn(
            'text-[10px] font-semibold uppercase tracking-[0.08em] font-ui',
            isCritical ? 'text-[#EF4444]/80' : 'text-[#F59E0B]/80'
          )}
        >
          {isCritical ? 'Critical' : 'Warning'}
        </span>
        {/* Timestamp dimmed further (#404040) so it reads as pure metadata */}
        <span className="text-[10px] text-[#404040] font-data tabular-nums">
          {formatTimeOnly(alert.created_at)}
        </span>
      </div>

      {/* ── Row 2: Alert title — primary read target ── */}
      {/* Dropped from mb-4 to mb-3; 13px semibold is the visual anchor of the card */}
      <p className="text-[13px] font-semibold text-[#DEDEDE] font-ui leading-snug mb-3">
        {formatAlertType(alert.type)}
      </p>

      {/* ── Row 3: Plate chip OR camera label as context fallback ── */}
      {/* camera_label shown for camera_fault alerts that have no plate — adds useful context */}
      {alert.plate_number ? (
        <PlateTag plate={alert.plate_number} size="sm" />
      ) : alert.camera_label ? (
        <span className="text-[10px] text-[#484848] font-data tracking-wide">
          {alert.camera_label}
        </span>
      ) : (
        <span className="text-[10px] text-[#333333] font-data tracking-widest">NO PLATE</span>
      )}
    </div>
  );
}