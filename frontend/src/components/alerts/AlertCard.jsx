import React, { useState } from 'react';
import { cn, formatTimeOnly } from '../../lib/utils';
import StatusDot from '../ui/StatusDot';

export default function AlertCard({ alert, onResolve }) {
  const [isResolving, setIsResolving] = useState(false);
  
  const getSeverityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-[#EF4444]';
      case 'warning': return 'text-[#F59E0B]';
      case 'info': return 'text-[#3B82F6]';
      default: return 'text-[#888888]';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-[#EF4444]';
      case 'warning': return 'bg-[#F59E0B]';
      case 'info': return 'bg-[#3B82F6]';
      default: return 'bg-[#888888]';
    }
  };

  const formatAlertType = (type) => {
    switch (type) {
      case 'blacklisted_vehicle': return 'BLACKLIST MATCH';
      case 'camera_fault': return 'CAMERA FAULT';
      case 'wrong_way': return 'WRONG WAY';
      case 'speeding': return 'SPEEDING';
      default: return (type?.replace(/_/g, ' ') || 'ALERT').toUpperCase();
    }
  };

  const handleResolve = async (e) => {
    e.stopPropagation();
    setIsResolving(true);
    if (onResolve) await onResolve(alert.id);
  };

  const severityColor = getSeverityStyle(alert.severity);
  const severityBg = getSeverityBg(alert.severity);

  return (
    <div
      className={cn(
        'group relative px-5 py-4 transition-all duration-150 hover:bg-[#1E1E1E] cursor-pointer flex flex-col font-ui',
        isResolving && 'opacity-30 pointer-events-none'
      )}
    >
      {/* Header: Dot + Title */}
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-2 h-2 rounded-full ${severityBg} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
        <span className={`text-[12px] font-bold tracking-wider ${severityColor}`}>
          {formatAlertType(alert.type)}
        </span>
      </div>

      {/* Description */}
      <div className="text-[13px] text-[#DEDEDE] leading-snug mb-2 pl-4">
        {alert.plate_number ? (
          <>{alert.plate_number} detected at {alert.camera_id}</>
        ) : (
          <>{alert.camera_label || alert.camera_id}</>
        )}
      </div>

      {/* Footer Metadata */}
      <div className="flex items-center justify-between text-[11px] font-data text-[#888888] pl-4">
        <div className="flex items-center gap-1.5">
          <span>{alert.camera_label?.split('–')[0]?.trim() || alert.camera_id}</span>
          <span>·</span>
          <span>{formatTimeOnly(alert.created_at)}</span>
        </div>
        
        {alert.status === 'active' ? (
          <button 
            onClick={handleResolve}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#3B82F6] hover:text-[#60A5FA] uppercase tracking-wider font-bold"
          >
            Resolve
          </button>
        ) : (
          <span className="text-[#22C55E] uppercase tracking-wider font-bold">Resolved</span>
        )}
      </div>
    </div>
  );
}