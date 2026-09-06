import React from 'react';
import { cn } from '../../lib/utils';
import StatusDot from '../ui/StatusDot';

export default function AlertBadge({ severity, className }) {
  const isCritical = severity?.toLowerCase() === 'critical';

  return (
    <span
      className={cn(
        // px-2 py-0.5: compact enough to work inline without dominating surrounding text
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px]',
        'text-[10px] font-semibold font-ui uppercase tracking-[0.08em]',
        isCritical
          ? 'bg-[#2A0F0F] text-[#EF4444]/90 border border-[#EF4444]/20'
          : 'bg-[#F59E0B]/08 text-[#F59E0B]/90 border border-[#F59E0B]/20',
        className
      )}
    >
      {/* pulse=false: static dot is sufficient; pulsing in dense lists creates visual noise */}
      <StatusDot status={isCritical ? 'critical' : 'warning'} size="sm" pulse={false} />
      {isCritical ? 'Critical' : 'Warning'}
    </span>
  );
}