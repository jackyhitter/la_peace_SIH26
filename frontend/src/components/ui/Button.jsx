import React from 'react';
import { cn } from '../../lib/utils';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors select-none rounded-[4px] disabled:opacity-40 disabled:cursor-not-allowed font-ui';

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-1 h-7 gap-1.5',
    md: 'text-[13px] px-3.5 py-1.5 h-8 gap-2',
    lg: 'text-[15px] px-4 py-2 h-10 gap-2.5',
  }[size] || 'text-[13px] px-3.5 py-1.5 h-8';

  const variantStyles = {
    primary: 'bg-[#F0F0F0] text-[#111111] hover:bg-[#DEDEDE] active:bg-[#CCCCCC]',
    outline: 'border border-[#2A2A2A] bg-transparent text-[#888888] hover:border-[#3D3D3D] hover:text-[#F0F0F0] active:bg-[#1E1E1E]',
    danger:  'border border-[#EF4444]/40 bg-transparent text-[#EF4444] hover:bg-[#EF4444]/10 active:bg-[#EF4444]/20',
    ghost:   'bg-transparent text-[#888888] hover:text-[#F0F0F0] hover:bg-[#1E1E1E]',
    subtle:  'bg-[#1E1E1E] text-[#F0F0F0] border border-[#2A2A2A] hover:border-[#3D3D3D]',
  }[variant] || 'bg-[#F0F0F0] text-[#111111]';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseStyles, sizeStyles, variantStyles, className)}
      {...props}
    >
      {children}
    </button>
  );
}
