import React from 'react';
import { cn } from '../../lib/utils';

export function Table({ children, className }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full text-left border-collapse text-[13px]', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className }) {
  return (
    <thead className={cn('bg-[#161616] border-b border-[#2A2A2A] sticky top-0 z-10', className)}>
      {children}
    </thead>
  );
}

export function TableHeader({ children, className, mono = false }) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-[#888888] font-medium text-[12px] uppercase tracking-wider',
        mono ? 'font-data' : 'font-ui',
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableBody({ children, className }) {
  return (
    <tbody className={cn('divide-y divide-[#2A2A2A]/60', className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, onClick, isResolved = false }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'h-[44px] transition-colors bg-[#161616] even:bg-[#1E1E1E]/40 hover:bg-[#1E1E1E]',
        onClick && 'cursor-pointer',
        isResolved && 'opacity-60',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className, mono = false }) {
  return (
    <td
      className={cn(
        'px-4 py-2.5 text-[#F0F0F0]',
        mono ? 'font-data' : 'font-ui',
        className
      )}
    >
      {children}
    </td>
  );
}

export function TableSkeletonRows({ columns = 5, rows = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="h-[44px] bg-[#161616] even:bg-[#1E1E1E]/40">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <td key={cIdx} className="px-4 py-2.5">
              <div className="h-4 rounded bg-[#1E1E1E] skeleton-row" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

