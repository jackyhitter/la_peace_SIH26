import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function PlateTag({
  plate,
  clickable = true,
  size = 'md',
  className,
}) {
  const navigate = useNavigate();

  if (!plate) return <span className="text-[#3D4F6B] font-data">—</span>;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-[13px] px-2.5 py-1',
    lg: 'text-[16px] px-3.5 py-1.5',
  }[size] || 'text-[13px] px-2.5 py-1';

  const handleClick = (e) => {
    if (!clickable) return;
    e.stopPropagation();
    navigate(`/search?plate=${encodeURIComponent(plate)}`);
  };

  return (
    <span
      onClick={clickable ? handleClick : undefined}
      className={cn(
        'inline-flex items-center font-data font-medium tracking-wide bg-[#1A1A1A] text-[#3E7BFA] border border-[#2A2A2A] rounded-[4px] select-all',
        clickable && 'cursor-pointer hover:border-[#3E7BFA] hover:bg-[#3E7BFA]/10 transition-colors',
        sizeClasses,
        className
      )}
      title={clickable ? `Lookup ${plate} in RTO database` : plate}
    >
      {plate}
    </span>
  );
}
