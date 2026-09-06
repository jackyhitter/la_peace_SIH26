import React from 'react';
import { cn } from '../../lib/utils';

export default function PageWrapper({
  title,
  subtitle,
  actions,
  children,
  className,
  fullWidth = false,
}) {
  return (
    <div className={cn('h-full w-full flex flex-col overflow-y-auto bg-[#111111] text-left', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] bg-[#161616]/60 shrink-0">
          <div>
            <h1 className="text-[20px] font-semibold text-[#F0F0F0] tracking-tight font-ui">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[12px] text-[#888888] mt-0.5 font-ui">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2.5">{actions}</div>}
        </div>
      )}
      <div className={cn('flex-1 p-6', fullWidth ? 'w-full' : 'max-w-7xl w-full mx-auto')}>
        {children}
      </div>
    </div>
  );
}

