import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ label, value, subtext, trend, className }) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={12} className="text-[#22C55E]" />;
    if (trend === 'down') return <TrendingDown size={12} className="text-[#EF4444]" />;
    if (trend === 'neutral') return <Minus size={12} className="text-[#888888]" />;
    return null;
  };

  return (
    <div
      className={cn(
        'bg-[#141414] border border-[#2A2A2A] rounded-[6px] p-4 text-left transition-colors font-ui flex flex-col justify-between h-full min-w-0 relative overflow-hidden group hover:border-[#3A3A3A]',
        className
      )}
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-[#ffffff03] opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-3 truncate flex justify-between items-center">
        {label}
        {getTrendIcon()}
      </div>
      <div className="flex-1 flex flex-col justify-end">
        <div className="text-[32px] font-bold text-[#F0F0F0] font-data tracking-tight leading-none truncate w-full mb-1">
          {value}
        </div>
        {subtext && (
          <div className="text-[11px] text-[#666666] font-ui truncate font-medium">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}
