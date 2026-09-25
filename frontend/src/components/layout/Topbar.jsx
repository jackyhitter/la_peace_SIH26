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
    <header className="h-14 w-full bg-var(--bg-surface) bg-[#161616] border-b border-[#2A2A2A] px-6 flex items-center justify-between shrink-0 select-none z-30 font-ui relative">
      {/* Left section: Wordmark + Context Subtitle */}
      <div className="flex items-center gap-5 h-full">
        <span className="font-serif text-[24px] font-bold text-[#F0F0F0] tracking-tight leading-none">
          Dri<em className="italic text-[#888888]">shti</em>
        </span>
        <div className="h-5 w-[1px] bg-[#2A2A2A]" />
        <span className="text-[12px] text-[#AAAAAA] hidden sm:inline font-ui tracking-widest uppercase mt-0.5">
          Traffic Intelligence
        </span>
      </div>

      {/* Center: Sensor Status Pills */}
      <div className="flex items-center gap-3 font-data text-[12px] h-full absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#1E1E1E] border border-[#2A2A2A]">
          <StatusDot status="active" size="sm" pulse />
          <span className="text-[#F0F0F0] font-medium">{summary.active || 44}</span>
          <span className="text-[#888888]">Active</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#1E1E1E] border border-[#2A2A2A]">
          <StatusDot status="fault" size="sm" />
          <span className="text-[#F59E0B] font-medium">{summary.fault || 2}</span>
          <span className="text-[#888888]">Fault</span>
        </div>
      </div>

      {/* Right section: Live Clock & Operator Profile */}
      <div className="flex items-center gap-6 h-full">
        {/* Live IST Clock */}
        <div className="text-[12px] text-[#AAAAAA] font-data font-medium tracking-wide">
          {currentTime || '12:00:00 IST'}
        </div>

        <div className="h-5 w-[1px] bg-[#2A2A2A]" />

        {/* Profile Dropdown */}
        <div className="relative h-full flex items-center" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={`flex items-center gap-3 px-3 py-1.5 rounded-[4px] transition-colors border focus:outline-none ${dropdownOpen ? 'bg-[#222222] border-[#2A2A2A]' : 'hover:bg-[#222222] border-transparent hover:border-[#2A2A2A]'
              }`}
          >
            <div className="flex items-center justify-center w-7 h-7 bg-[#1E1E1E] border border-[#2A2A2A] rounded-full">
              <User size={14} strokeWidth={2} className="text-[#888888]" />
            </div>
            <div className="flex flex-col items-start text-left ">
              <span className="text-[13px]  font-medium text-[#F0F0F0] leading-none capitalize">
                {operator?.username || 'Admin'}
              </span>
              <span className="text-[11px] text-[#888888] leading-none mt-1 capitalize">
                {operator?.display_name || 'Chief Controller'}
              </span>
            </div>
            <ChevronDown size={14} strokeWidth={1.5} className={`text-[#666666] ml-1 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-[calc(100%+6px)] right-0 w-[240px] bg-[#161616] border border-[#2A2A2A] rounded-[6px] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.8)] z-50 overflow-hidden flex flex-col font-ui animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="pl-7 pr-5 py-4 border-b border-[#2A2A2A] flex flex-col bg-[#1A1A1A]">
                <span className="text-[15px] font-semibold text-[#F0F0F0] leading-tight capitalize">
                  {operator?.username || 'Admin'}
                </span>
                <span className="text-[13px] text-[#888888] mt-1.5 capitalize leading-tight">
                  {operator?.display_name || 'Chief Controller'}
                </span>
              </div>

              <div className="pl-7 pr-5 py-3.5 border-b border-[#2A2A2A]">
                <div className="text-[11px] text-[#666666] uppercase tracking-widest font-semibold mb-1">
                  Access Level
                </div>
                <div className="text-[13px] text-[#DDDDDD] font-medium uppercase tracking-wide">
                  {operator?.role || 'System Operator'}
                </div>
              </div>

              <div className="py-2 px-3">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 text-left pl-4 pr-3 py-2.5 text-[14px] text-[#EF4444] hover:bg-[#2A1010] hover:text-[#F87171] rounded-[4px] transition-colors group"
                >
                  <LogOut size={16} strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform" />
                  <span className="font-semibold tracking-wide">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
