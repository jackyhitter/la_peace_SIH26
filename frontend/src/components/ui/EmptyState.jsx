import React from 'react';
import { cn } from '../../lib/utils';

export default function EmptyState({
  title = 'No records found',
  description = 'No sightings or events recorded for this criteria.',
  icon: Icon,
  action,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#2A2A2A] rounded-[6px] bg-[#161616]/40', className)}>
      {Icon && (
        <div className="p-3 mb-3 rounded-full bg-[#1E1E1E] text-[#888888]">
          <Icon size={24} strokeWidth={1.5} />
        </div>
      )}
      <h4 className="text-[15px] font-medium text-[#F0F0F0] mb-1 font-ui">{title}</h4>
      <p className="text-[13px] text-[#888888] max-w-sm mb-4 font-ui leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

