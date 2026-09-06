import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCameras } from '../../hooks/useCameras';
import StatusDot from '../ui/StatusDot';
import { ChevronDown, User, LogOut } from 'lucide-react';

export default function Topbar() {
  const { operator, logout } = useAuth();
  const { summary } = useCameras();
  const [currentTime, setCurrentTime] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(now);
      setCurrentTime(`${timeStr} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 w-full bg-[#161616] border-b border-[#2A2A2A] pl-8 pr-6 flex items-center justify-between shrink-0 select-none z-30 font-ui">
      {/* Left section: Wordmark + Context Subtitle */}
      <div className="flex items-center gap-5">
        <span className="font-serif text-[26px] font-bold text-[#F0F0F0] tracking-tight leading-none">
          Dri<em className="italic text-[#888888]">shti</em>
        </span>
        <div className="h-6 w-[1px] bg-[#2A2A2A]" />
        <span className="text-[13px] text-[#AAAAAA] hidden sm:inline font-ui tracking-widest uppercase">
          Traffic Intelligence
        </span>
      </div>

      {/* Center: Sensor Status Pills */}
      <div className="flex items-center gap-2 font-data text-[12px]">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-[3px] bg-[#1E1E1E] border border-[#2A2A2A]">
          <StatusDot status="active" size="sm" pulse />
          <span className="text-[#F0F0F0] font-medium">{summary.active || 44}</span>
          <span className="text-[#888888]">Active</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-[3px] bg-[#1E1E1E] border border-[#2A2A2A]">
          <StatusDot status="fault" size="sm" />
          <span className="text-[#F59E0B] font-medium">{summary.fault || 2}</span>
          <span className="text-[#888888]">Fault</span>
        </div>
      </div>

      {/* Right section: Live Clock & Operator Profile */}
      <div className="flex items-center gap-4">
        {/* Live IST Clock */}
        <div className="text-[13px] text-[#F0F0F0] font-data font-medium">
          {currentTime || '12:00:00 IST'}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] text-[#F0F0F0] hover:bg-[#222222] rounded-[4px] transition-colors border border-transparent hover:border-[#2A2A2A]"
          >
            <User size={15} strokeWidth={1.5} className="text-[#AAAAAA]" />
            <span className="font-medium capitalize">{operator?.username || 'Admin'}</span>
            <ChevronDown size={14} strokeWidth={1.5} className="text-[#666666]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#1A1A1A] border border-[#2A2A2A] rounded-[6px] shadow-2xl py-1.5 z-50">
              <div className="px-3.5 py-2.5 border-b border-[#2A2A2A]">
                <p className="text-[13px] font-medium text-[#F0F0F0] capitalize">
                  {operator?.display_name || 'Chief Controller'}
                </p>
                <p className="text-[11px] text-[#666666] font-data mt-0.5">
                  {operator?.role || 'Operator'}
                </p>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 text-left px-3.5 py-2 mt-1 text-[12px] text-[#EF4444] hover:bg-[#2A1010] transition-colors"
              >
                <LogOut size={13} strokeWidth={1.5} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
