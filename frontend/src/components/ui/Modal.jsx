import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
  className,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative w-full bg-[#242424] border border-[#2A2A2A] rounded-[6px] shadow-2xl z-10 overflow-hidden font-ui animate-in fade-in zoom-in-95 duration-150',
          maxWidth,
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
            <h3 className="text-[16px] font-medium text-[#F0F0F0]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 text-[#888888] hover:text-[#F0F0F0] rounded transition-colors"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
