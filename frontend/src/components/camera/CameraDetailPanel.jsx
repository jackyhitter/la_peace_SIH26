import React, { useState, useEffect } from 'react';
import { X, Activity } from 'lucide-react';
import StatusDot from '../ui/StatusDot';
import CameraFeedTile from './CameraFeedTile';
import PlateTag from '../plates/PlateTag';
import api from '../../lib/api';
import { formatTimeOnly } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function CameraDetailPanel({ camera, onClose }) {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!camera) return;
    let isCurrent = true;
    const fetchLogs = async () => {
      try {
        const res = await api.get('/api/plates/logs', { params: { camera_id: camera.id, limit: 5 } });
        if (isCurrent && res.data?.items) {
          setLogs(res.data.items);
        }
      } catch (err) {}
    };
    fetchLogs();
    
    // Simulate real-time updates for demo purposes
    const interval = setInterval(fetchLogs, 5000);
    return () => {
      isCurrent = false;
      clearInterval(interval);
    };
  }, [camera]);

  if (!camera) return null;

  return (
    <div className="w-full h-full flex flex-col bg-[#161616] font-ui">
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-[#2A2A2A] bg-[#1A1A1A] shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-[16px] font-bold text-[#F0F0F0] font-data">{camera.id}</h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] bg-[#1E1E1E] border border-[#2A2A2A] text-[10px] font-medium">
              <StatusDot status={camera.status} size="sm" pulse={camera.status === 'active'} />
              <span className="text-[#888888] uppercase tracking-wider">{camera.status}</span>
            </div>
          </div>
          <p className="text-[12px] text-[#AAAAAA] truncate">{camera.label || camera.sector}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-[#888888] hover:text-[#F0F0F0] hover:bg-[#222222] rounded transition-colors"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Live Video Feed */}
        <div className="rounded-[6px] overflow-hidden border border-[#2A2A2A] bg-black shadow-lg relative h-[200px]">
          <CameraFeedTile 
            camera={camera} 
            isMaximized={false}
            onToggleMaximize={() => {}}
            onSourceChange={() => {}}
            showAiOverlay={true}
            stealthMode={true}
          />
        </div>

        {/* Camera Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1E1E1E] p-3 rounded-[6px] border border-[#2A2A2A]">
            <div className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">FPS / Res</div>
            <div className="text-[13px] text-[#F0F0F0] font-data font-medium">
              {camera.fps || '25.0'} / {camera.resolution || '1080P'}
            </div>
          </div>
          <div className="bg-[#1E1E1E] p-3 rounded-[6px] border border-[#2A2A2A]">
            <div className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Vehicles Today</div>
            <div className="text-[13px] text-[#F0F0F0] font-data font-medium">
              {camera.read_count ? camera.read_count.toLocaleString() : '1,842'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/ai-detection')}
            className="w-full h-8 flex items-center justify-center bg-[#2A2A2A] hover:bg-[#333333] border border-[#3A3A3A] text-[#E0E0E0] text-[11px] font-semibold tracking-wide uppercase rounded-[4px] transition-colors"
          >
            Live AI Stream
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="w-full h-8 flex items-center justify-center bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-[#3B82F6] text-[11px] font-semibold tracking-wide uppercase rounded-[4px] transition-colors"
          >
            Node Analytics
          </button>
        </div>

        {/* Recent Detections List */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={14} className="text-[#3B82F6]" />
            <h3 className="text-[12px] font-semibold text-[#F0F0F0] uppercase tracking-wider">Recent Detections</h3>
          </div>
          
          <div className="space-y-2">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div 
                  key={log.id} 
                  onClick={() => navigate(`/search?plate=${log.plate_number}`)}
                  className="flex items-center justify-between p-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-[4px] hover:bg-[#222222] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#888888] font-data w-16">
                      {formatTimeOnly(log.event_time)}
                    </span>
                    <PlateTag plate={log.plate_number} size="sm" />
                  </div>
                  <span className="text-[10px] font-data text-[#555555] group-hover:text-[#3B82F6] transition-colors">
                    {(log.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              ))
            ) : (
              <div className="text-[12px] text-[#666666] italic py-4 text-center border border-dashed border-[#2A2A2A] rounded-[4px]">
                No recent detections
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
