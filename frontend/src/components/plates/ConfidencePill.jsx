import React from 'react';
import { cn } from '../../lib/utils';

export default function ConfidencePill({ confidence, className }) {
  if (confidence === null || confidence === undefined) {
    return <span className="text-[#555555] font-data text-[11px]">—</span>;
  }

  const score = Number(confidence);
  const isHigh = score >= 90;
  const isMedium = score >= 70 && score < 90;
  const isLow = score < 70;

  const colorStyles = isHigh
    ? 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30'
    : isMedium
    ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
    : 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';

  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded-[3px] border text-[11px] font-data font-medium tabular-nums',
        colorStyles,
        className
      )}
    >
      {score.toFixed(1)}%
    </span>
  );
}
