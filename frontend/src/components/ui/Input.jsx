import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(function Input(
  {
    type = 'text',
    mono = false,
    label,
    error,
    helperText,
    className,
    ...props
  },
  ref
) {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label className="text-[11px] font-medium text-[#555555] font-ui uppercase tracking-[0.07em]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full px-3 py-2 bg-[#1E1E1E] border border-[#2A2A2A] rounded-[var(--radius-md)] text-[#F0F0F0] text-[13px] placeholder:text-[#333333] focus:outline-none focus:border-[#3D3D3D] transition-colors',
          mono ? 'font-data' : 'font-ui',
          error && 'border-[#EF4444] focus:border-[#EF4444]',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-[11px] text-[#EF4444] font-ui">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-[11px] text-[#888888] font-ui">{helperText}</span>
      )}
    </div>
  );
});

export default Input;
