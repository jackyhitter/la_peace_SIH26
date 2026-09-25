import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import { Settings2, User, Key, ShieldAlert, Cpu, Activity, RotateCcw } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('system');

  const tabs = [
    { id: 'system', label: 'System Status', icon: Activity },
    { id: 'preferences', label: 'User Preferences', icon: User },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'danger', label: 'Danger Zone', icon: ShieldAlert },
  ];

  return (
    <PageWrapper
      title="System Settings"
      subtitle="Configure application preferences, API connectivity, and system status"
      fullWidth
    >
      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto h-[calc(100vh-120px)]">
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[6px] text-[13px] font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1E1E1E] text-[#F0F0F0] border border-[#2A2A2A]'
                  : 'text-[#888888] hover:text-[#E0E0E0] hover:bg-[#161616] border border-transparent'
              }`}
            >
              <tab.icon size={16} strokeWidth={1.5} className={activeTab === tab.id ? 'text-[#3E7BFA]' : ''} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-[#161616] border border-[#2A2A2A] rounded-[6px] overflow-hidden flex flex-col">
          <div className="p-6 overflow-y-auto flex-1 space-y-8">
            
            {activeTab === 'system' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-[16px] font-semibold text-[#F0F0F0] font-ui flex items-center gap-2">
                    <Activity size={18} className="text-[#3E7BFA]" />
                    System Status
                  </h2>
                  <p className="text-[13px] text-[#888888] font-ui mt-1">Current operational status of connected modules</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#111111] border border-[#2A2A2A] rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[13px] font-medium text-[#F0F0F0]">Core Processing</span>
                      <span className="flex items-center gap-1.5 text-[12px] text-[#22C55E]">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> Online
                      </span>
                    </div>
                    <div className="text-[11px] text-[#888888] font-data">Uptime: 42d 18h 03m</div>
                  </div>
                  <div className="bg-[#111111] border border-[#2A2A2A] rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[13px] font-medium text-[#F0F0F0]">Database (RTO Records)</span>
                      <span className="flex items-center gap-1.5 text-[12px] text-[#22C55E]">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> Connected
                      </span>
                    </div>
                    <div className="text-[11px] text-[#888888] font-data">Latency: 12ms</div>
                  </div>
                  <div className="bg-[#111111] border border-[#2A2A2A] rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[13px] font-medium text-[#F0F0F0]">Video Stream Gateway</span>
                      <span className="flex items-center gap-1.5 text-[12px] text-[#22C55E]">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> Active
                      </span>
                    </div>
                    <div className="text-[11px] text-[#888888] font-data">Active Streams: 32/32</div>
                  </div>
                  <div className="bg-[#111111] border border-[#2A2A2A] rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[13px] font-medium text-[#F0F0F0]">AI Inference Engine</span>
                      <span className="flex items-center gap-1.5 text-[12px] text-[#F59E0B]">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span> High Load
                      </span>
                    </div>
                    <div className="text-[11px] text-[#888888] font-data">GPU Util: 94%</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-[16px] font-semibold text-[#F0F0F0] font-ui flex items-center gap-2">
                    <User size={18} className="text-[#3E7BFA]" />
                    User Preferences
                  </h2>
                  <p className="text-[13px] text-[#888888] font-ui mt-1">Manage your interface and alert settings</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                    <div>
                      <div className="text-[14px] font-medium text-[#F0F0F0]">Dark Mode</div>
                      <div className="text-[12px] text-[#888888] mt-0.5">Toggle interface dark mode</div>
                    </div>
                    <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded px-3 py-1.5 text-[12px] text-[#F0F0F0]">Always On (Forced)</div>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                    <div>
                      <div className="text-[14px] font-medium text-[#F0F0F0]">Audio Alerts</div>
                      <div className="text-[12px] text-[#888888] mt-0.5">Play sound on critical restricted vehicle sightings</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-9 h-5 bg-[#2A2A2A] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3E7BFA]"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-[16px] font-semibold text-[#F0F0F0] font-ui flex items-center gap-2">
                    <Key size={18} className="text-[#3E7BFA]" />
                    API Keys
                  </h2>
                  <p className="text-[13px] text-[#888888] font-ui mt-1">Manage API keys for external integrations</p>
                </div>
                
                <div className="bg-[#111111] border border-[#2A2A2A] rounded-[6px] p-4">
                  <div className="flex items-center justify-between mb-4 border-b border-[#2A2A2A] pb-3">
                    <div>
                      <div className="text-[14px] font-medium text-[#F0F0F0]">Vahan RTO API Integration</div>
                      <div className="text-[12px] text-[#888888] mt-0.5">Used for fetching vehicle registration details</div>
                    </div>
                    <Button variant="outline" size="sm">Rotate Key</Button>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      value="********************************" 
                      readOnly
                      className="bg-[#1A1A1A] border border-[#2A2A2A] text-[#888888] text-[13px] rounded px-3 py-2 flex-1 font-mono outline-none"
                    />
                    <Button variant="secondary" size="md">Copy</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-[16px] font-semibold text-[#EF4444] font-ui flex items-center gap-2">
                    <ShieldAlert size={18} className="text-[#EF4444]" />
                    Danger Zone
                  </h2>
                  <p className="text-[13px] text-[#888888] font-ui mt-1">Irreversible system actions and demo resets</p>
                </div>
                
                <div className="border border-[#EF4444]/30 bg-[#2A1010]/30 rounded-[6px] p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="text-[14px] font-semibold text-[#F0F0F0]">Reset Demo Data</div>
                      <div className="text-[12px] text-[#888888] mt-1 max-w-lg">
                        This will clear all simulated detection logs, restore the default restricted vehicles list, and reset the timeline. This action cannot be undone.
                      </div>
                    </div>
                    <Button variant="danger" size="md" className="shrink-0">
                      <RotateCcw size={14} className="mr-2" />
                      Reset System State
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
