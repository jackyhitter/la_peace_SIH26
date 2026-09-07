import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Map,
  BarChart2,
  Bell,
  ScrollText,
  Search,
  ShieldAlert,
  LogOut,
  Cpu,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const mainNavItems = [
    { icon: Map, path: '/dashboard', tooltip: 'Map View' },
    { icon: BarChart2, path: '/analytics', tooltip: 'Analytics' },
    { icon: Bell, path: '/alerts', tooltip: 'Alerts' },
    { icon: ScrollText, path: '/logs', tooltip: 'Plate Logs' },
    { icon: Search, path: '/search', tooltip: 'Plate Search' },
    { icon: ShieldAlert, path: '/restricted', tooltip: 'Restricted Vehicles' },
    { icon: Cpu, path: '/ai-detection', tooltip: 'Live AI Detection' },
  ];

  return (
    <aside className="w-14 h-full bg-[#141414] border-r border-[#222222] flex flex-col justify-between shrink-0 select-none py-3 z-20">
      {/* Top Nav Items */}
      <nav className="flex flex-col items-center gap-1 w-full px-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={item.tooltip}
              className={cn(
                'w-full h-11 flex items-center justify-center transition-all duration-150 relative rounded-[5px]',
                isActive
                  ? 'bg-[#252525] text-[#F0F0F0] shadow-sm'
                  : 'text-[#606060] hover:text-[#AAAAAA] hover:bg-[#1C1C1C]'
              )}
            >
              {/* Active indicator strip */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#E0E0E0] rounded-r-full" />
              )}
              <Icon size={20} strokeWidth={isActive ? 1.5 : 1.5} />
            </button>
          );
        })}
      </nav>

      {/* Bottom Nav Items */}
      <div className="flex flex-col items-center gap-1 w-full px-2 pb-1 border-t border-[#222222] pt-3">
        <button
          onClick={logout}
          title="Sign out"
          className="w-full h-11 flex items-center justify-center rounded-[5px] text-[#EF4444] hover:bg-[#2A1010] transition-all duration-150"
        >
          <LogOut size={19} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
