import React, { useEffect, useRef } from 'react';
import { CAMERA_NODES, CHANDIGARH_CENTER } from '../../lib/constants';

export default function Minimap({ viewport, onSelectCenter }) {
  const canvasRef = useRef(null);

  // Chandigarh bounding box approx for canvas projection:
  // Lng: 76.72 to 76.84 (width ~ 0.12)
  // Lat: 30.69 to 30.78 (height ~ 0.09)
  const minLng = 76.72;
  const maxLng = 76.84;
  const minLat = 30.69;
  const maxLat = 30.78;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#080C14';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid lines
    ctx.strokeStyle = '#161D2E';
    ctx.lineWidth = 1;
    for (let x = 20; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 20; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const project = (lng, lat) => {
      const x = ((lng - minLng) / (maxLng - minLng)) * width;
      const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
      return [x, y];
    };

    // Draw camera dots
    CAMERA_NODES.forEach((cam) => {
      const [lng, lat] = cam.coords;
      const [x, y] = project(lng, lat);
      const isFault = cam.status === 'fault';

      ctx.beginPath();
      ctx.arc(x, y, isFault ? 2.5 : 2, 0, 2 * Math.PI);
      ctx.fillStyle = isFault ? '#B47828' : '#328C5A';
      ctx.fill();
    });

    // Draw Viewport Bounding Box
    if (viewport) {
      const { longitude, latitude, zoom } = viewport;
      const [cx, cy] = project(longitude, latitude);

      // Box size inversely proportional to zoom
      const zoomFactor = Math.pow(2, 12 - (zoom || 12));
      const boxW = Math.max(16, Math.min(width * 0.9, 36 * zoomFactor));
      const boxH = Math.max(12, Math.min(height * 0.9, 28 * zoomFactor));

      ctx.strokeStyle = '#3E7BFA';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH);
      ctx.fillStyle = 'rgba(62, 123, 250, 0.12)';
      ctx.fillRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH);
    }
  }, [viewport]);

  return (
    <div className="absolute bottom-4 left-4 z-30 w-[160px] h-[120px] bg-[#080C14] border border-[#1E2940] overflow-hidden select-none pointer-events-auto">
      {/* Label */}
      <div className="absolute top-1.5 left-2 z-10 text-[9px] font-medium text-[#3D4F6B] font-data tracking-wider uppercase">
        Network Overview
      </div>
      <canvas
        ref={canvasRef}
        width={160}
        height={120}
        className="w-full h-full block"
      />
    </div>
  );
}
