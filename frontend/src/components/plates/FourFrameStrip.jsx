import React from 'react';

export default function FourFrameStrip({ plate, confidence = 96.4, speed = 54 }) {
  // Mock data for the 4-frame strip since we don't have actual vehicle images per search
  const frames = [
    { id: 'entry', label: 'ENTRY', conf: confidence - 1.2, img: '/crops/frame_5318_entry.jpg' },
    { id: 'lock', label: 'LOCKED', conf: confidence, img: '/crops/crop_ea61_evg.jpg' },
    { id: 'exit', label: 'EXIT', conf: confidence - 0.8, img: '/crops/frame_5332_exit.jpg' },
    { id: 'context', label: 'CONTEXT', conf: null, img: '/crops/crop_lr09_fsl.jpg' },
  ];

  const getColor = (conf) => {
    if (!conf) return 'text-[#888888]';
    if (conf >= 90) return 'text-[#22C55E]';
    if (conf >= 75) return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  return (
    <div className="bg-[#161616] border border-[#2A2A2A] rounded-[6px] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-[#F0F0F0] font-ui uppercase tracking-wider">
          Capture Sequence
        </h3>
        <div className="flex gap-4 text-[11px] font-data">
          <span className="text-[#888888]">Speed: <span className="text-[#F0F0F0] font-medium">{speed} km/h</span></span>
          <span className="text-[#888888]">Avg Conf: <span className={getColor(confidence)}>{confidence}%</span></span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {frames.map(f => (
          <div key={f.id} className="flex flex-col gap-1 border border-[#2A2A2A] p-1.5 rounded-[4px] bg-[#111111]">
            <div className="relative h-[80px] w-full bg-[#0A0A0A] rounded-[2px] overflow-hidden">
              <img src={f.img} alt={f.label} className="w-full h-full object-cover opacity-80" onError={(e) => { e.target.style.display = 'none'; }} />
              {/* Fallback placeholder if image missing */}
              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[#444444] -z-10 font-data">
                NO IMAGE
              </div>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-bold text-[#888888] tracking-wider">{f.label}</span>
              {f.conf && <span className={`text-[9px] font-data font-bold ${getColor(f.conf)}`}>{f.conf.toFixed(1)}%</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
