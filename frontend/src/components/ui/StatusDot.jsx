import React from 'react';
import { cn } from '../../lib/utils';

export default function StatusDot({ status = 'active', pulse = false, size = 'md', className }) {
  const isGreen = status === 'active' || status === 'healthy' || status === 'resolved';
  const isAmber = status === 'fault' || status === 'warning' || status === 'degraded';
  const isRed = status === 'critical' || status === 'offline' || status === 'blacklisted';

  const sizeClass = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size] || 'w-2 h-2';

  const colorClass = isGreen
    ? 'bg-[#22C55E]'
    : isAmber
    ? 'bg-[#F59E0B]'
    : isRed
    ? 'bg-[#EF4444]'
    : 'bg-[#7A8BA8]';

  return (
    <span className={cn('relative inline-flex items-center justify-center shrink-0', className)}>
      {pulse && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-40 animate-pulse-slow',
            colorClass
          )}
        />
      )}
      <span className={cn('rounded-full', sizeClass, colorClass)} />
    </span>
  );
}
