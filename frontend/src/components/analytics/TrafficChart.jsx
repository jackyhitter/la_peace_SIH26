import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#242424] border border-[#2A2A2A] rounded-[4px] p-2.5 shadow-xl font-ui text-[12px]">
        <div className="text-[#888888] font-data mb-1">Time: {label}</div>
        <div className="text-[#F0F0F0] font-data font-semibold">
          Vehicles: <span className="text-[#3E7BFA]">{data.vehicle_count?.toLocaleString('en-IN')}</span>
        </div>
        <div className="text-[#888888] font-data">
          Reads: {data.plate_reads?.toLocaleString('en-IN')}
        </div>
      </div>
    );
  }
  return null;
}

export function HourlyBarChart({ data }) {
  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#2A2A2A" strokeOpacity={0.4} vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#555555"
            fontSize={11}
            tickLine={false}
            interval={2}
            tick={{ fill: '#888888', fontFamily: 'var(--font-data)' }}
          />
          <YAxis
            stroke="#555555"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#888888', fontFamily: 'var(--font-data)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="vehicle_count"
            fill="#3E7BFA"
            opacity={0.85}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IntervalsAreaChart({ data }) {
  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3E7BFA" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3E7BFA" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#2A2A2A" strokeOpacity={0.4} vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#555555"
            fontSize={11}
            tickLine={false}
            interval={7}
            tick={{ fill: '#888888', fontFamily: 'var(--font-data)' }}
          />
          <YAxis
            stroke="#555555"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#888888', fontFamily: 'var(--font-data)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="vehicle_count"
            stroke="#3E7BFA"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#areaColor)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

