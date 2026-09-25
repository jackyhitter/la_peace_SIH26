import React, { useEffect, useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import MainMap from '../components/map/MainMap';
import AlertPanel from '../components/alerts/AlertPanel';
import CameraDetailPanel from '../components/camera/CameraDetailPanel';
import StatCard from '../components/analytics/StatCard';
import api from '../lib/api';
import { DEMO_DAY } from '../lib/constants';
import CameraRankTable from '../components/analytics/CameraRankTable';
import { HourlyBarChart } from '../components/analytics/TrafficChart';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [cameraRanking, setCameraRanking] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    const fetchDashboardData = async () => {
      try {
        const [sumRes, rankRes, hourRes] = await Promise.allSettled([
          api.get('/api/analytics/summary', { params: { date: DEMO_DAY } }),
          api.get('/api/analytics/camera-ranking', { params: { date: DEMO_DAY, limit: 5 } }),
          api.get('/api/analytics/traffic', { params: { window: 'hour', date: DEMO_DAY } }),
        ]);

        if (isCurrent) {
          if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data);
          if (rankRes.status === 'fulfilled') setCameraRanking(rankRes.value.data.cameras || []);
          if (hourRes.status === 'fulfilled') setHourlyData(hourRes.value.data.buckets || []);
        }
      } catch (err) {}
    };

    fetchDashboardData();
    return () => { isCurrent = false; };
  }, []);

  return (
    <PageWrapper
      title="Operations Console"
      subtitle="City-wide ANPR & Traffic Intelligence"
      fullWidth
      className="bg-[#111111]"
    >
      <div className="flex flex-col gap-5 h-full overflow-y-auto">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 shrink-0">
          <StatCard
            label="Vehicles Today"
            value={summary?.vehicles_today ? summary.vehicles_today.toLocaleString('en-IN') : '2,847'}
            subtext="Aggregated across 46 nodes"
            trend="up"
          />
          <StatCard
            label="Plates Read Accuracy"
            value={`${summary?.ocr_accuracy || 94.3}%`}
            subtext="Benchmark validation run"
            trend="neutral"
          />
          <StatCard
            label="Active Cameras"
            value={`${summary?.active_cameras || 44} / ${(summary?.active_cameras || 44) + (summary?.fault_cameras || 2)}`}
            subtext="2 nodes in maintenance"
          />
          <StatCard
            label="Alerts Today"
            value={summary?.alerts_today || 7}
            subtext="5 active · 2 resolved"
            trend="down"
          />
        </div>

        {/* Primary Operational Grid: Map + Alerts/CameraPanel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[500px]">
          <div className="lg:col-span-9 bg-[#161616] border border-[#2A2A2A] rounded-[6px] overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-[#2A2A2A] shrink-0 bg-[#1A1A1A]">
              <h3 className="text-[14px] font-semibold text-[#F0F0F0] font-ui uppercase tracking-wider">Live Network Map</h3>
            </div>
            <div className="flex-1 relative min-h-[400px]">
              <MainMap 
                selectedCamera={selectedCamera} 
                onSelectCamera={setSelectedCamera} 
              />
            </div>
          </div>
          
          <div className="lg:col-span-3 bg-[#161616] border border-[#2A2A2A] rounded-[6px] overflow-hidden flex flex-col h-[500px]">
            {selectedCamera ? (
              <CameraDetailPanel 
                camera={selectedCamera} 
                onClose={() => setSelectedCamera(null)} 
              />
            ) : (
              <AlertPanel />
            )}
          </div>
        </div>

        {/* Bottom Section: Camera Network & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 shrink-0">
          <div className="lg:col-span-5 bg-[#161616] border border-[#2A2A2A] rounded-[6px] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-semibold text-[#F0F0F0] font-ui uppercase tracking-wider">Camera Network</h3>
                <p className="text-[12px] text-[#888888] font-ui mt-1">Highest activity nodes</p>
              </div>
            </div>
            <CameraRankTable cameras={cameraRanking} />
          </div>
          
          <div className="lg:col-span-7 bg-[#161616] border border-[#2A2A2A] rounded-[6px] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-semibold text-[#F0F0F0] font-ui uppercase tracking-wider">Traffic Analytics</h3>
                <p className="text-[12px] text-[#888888] font-ui mt-1">Spatial and temporal distribution over network</p>
              </div>
            </div>
            <HourlyBarChart data={hourlyData} />
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
