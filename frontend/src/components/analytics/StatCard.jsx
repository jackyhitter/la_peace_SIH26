import React from 'react';
import { cn } from '../../lib/utils';

export default function StatCard({ label, value, subtext, className }) {
  return (
    <div
      className={cn(
        'bg-[#161616] border border-[#2A2A2A] rounded-[6px] p-4 text-left transition-colors font-ui',
        className
      )}
    >
      <div className="text-[13px] font-medium text-[#888888] mb-1.5">{label}</div>
      <div className="text-[26px] font-semibold text-[#F0F0F0] font-data tracking-tight">
        {value}
      </div>
      {subtext && (
        <div className="text-[11px] text-[#555555] mt-1 font-data">{subtext}</div>
      )}
    </div>
  );
}

