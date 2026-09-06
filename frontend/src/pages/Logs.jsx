import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Table, TableHead, TableHeader, TableBody, TableSkeletonRows } from '../components/ui/Table';
import LogRow from '../components/plates/LogRow';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import api from '../lib/api';
import { CAMERA_NODES, DEMO_DAY } from '../lib/constants';
import { ScrollText, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedCamera, setSelectedCamera] = useState('all');
  const [confidenceMin, setConfidenceMin] = useState('all');
  const [selectedDate, setSelectedDate] = useState(DEMO_DAY);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (currentPage = page) => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 50,
      };

      if (selectedCamera !== 'all') {
        params.camera_id = selectedCamera;
      }
      if (confidenceMin !== 'all') {
        params.confidence_min = parseFloat(confidenceMin);
      }
      if (selectedDate) {
        params.date = selectedDate;
      }

      const res = await api.get('/api/plates/logs', { params });
      setLogs(res.data?.items || []);
      setTotal(res.data?.total || 0);
      setPages(res.data?.pages || 1);
      setPage(res.data?.page || 1);
    } catch (err) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [selectedCamera, confidenceMin, selectedDate]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pages) return;
    setPage(newPage);
    fetchLogs(newPage);
  };

  const startRange = total === 0 ? 0 : (page - 1) * 50 + 1;
  const endRange = Math.min(page * 50, total);

  return (
    <PageWrapper
      title="Plate Logs"
      subtitle="Chronological audit trail of all optical plate reads across Chandigarh cameras"
      fullWidth
      actions={
        <div className="flex flex-wrap items-center gap-3">
          {/* Camera filter */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#888888] font-ui">
            <Filter size={13} strokeWidth={1.5} />
            <span>Camera:</span>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="bg-[#242424] border border-[#2A2A2A] rounded px-2 py-1 text-[#F0F0F0] focus:outline-none focus:border-[#3D3D3D] max-w-[160px]"
            >
              <option value="all">All Cameras (46)</option>
              {CAMERA_NODES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.sector}
                </option>
              ))}
            </select>
          </div>

          {/* Confidence Filter */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#888888] font-ui">
            <span>Confidence:</span>
            <select
              value={confidenceMin}
              onChange={(e) => setConfidenceMin(e.target.value)}
              className="bg-[#242424] border border-[#2A2A2A] rounded px-2 py-1 text-[#F0F0F0] focus:outline-none focus:border-[#3D3D3D]"
            >
              <option value="all">All Confidence</option>
              <option value="90">High (&gt; 90%)</option>
              <option value="75">Medium (&gt; 75%)</option>
              <option value="50">Low (&gt; 50%)</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#888888] font-ui">
            <span>Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#242424] border border-[#2A2A2A] rounded px-2 py-1 text-[#F0F0F0] focus:outline-none focus:border-[#3D3D3D] text-[12px] font-data"
            />
          </div>
        </div>
      }
    >
      <div className="border border-[#2A2A2A] rounded-[6px] overflow-hidden bg-[#161616]">
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Plate Number</TableHeader>
              <TableHeader mono>Camera ID</TableHeader>
              <TableHeader>Sector / Location</TableHeader>
              <TableHeader mono>Time (IST)</TableHeader>
              <TableHeader>OCR Confidence</TableHeader>
              <TableHeader>Restricted</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeletonRows columns={6} rows={10} />
            ) : logs.length > 0 ? (
              logs.map((log) => <LogRow key={log.id} log={log} />)
            ) : (
              <tr>
                <td colSpan={6} className="p-8">
                  <EmptyState
                    icon={ScrollText}
                    title="No plate events recorded"
                    description="No optical plate reads match the selected date and filter criteria."
                  />
                </td>
              </tr>
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#2A2A2A] bg-[#161616] font-ui">
          <span className="text-[12px] text-[#888888]">
            Showing <span className="font-data text-[#F0F0F0]">{startRange}–{endRange}</span> of{' '}
            <span className="font-data text-[#F0F0F0]">{total.toLocaleString('en-IN')}</span> reads
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => handlePageChange(page - 1)}
              className="h-8"
            >
              <ChevronLeft size={14} strokeWidth={1.5} className="mr-1" />
              Previous
            </Button>
            <span className="text-[12px] text-[#888888] font-data px-1">
              {page} / {pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pages || loading}
              onClick={() => handlePageChange(page + 1)}
              className="h-8"
            >
              Next
              <ChevronRight size={14} strokeWidth={1.5} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
