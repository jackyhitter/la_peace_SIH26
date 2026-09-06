import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeletonRows } from '../components/ui/Table';
import AlertBadge from '../components/alerts/AlertBadge';
import PlateTag from '../components/plates/PlateTag';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import api from '../lib/api';
import { formatISTTime } from '../lib/utils';
import { Bell, Check, Filter } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter,
        limit: 100,
      };
      if (severityFilter !== 'all') {
        params.severity = severityFilter;
      }

      const res = await api.get('/api/alerts', { params });
      setAlerts(res.data?.items || []);
    } catch (err) {
      // Keep existing
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter, severityFilter]);

  const handleResolve = async (alertId) => {
    try {
      await api.patch(`/api/alerts/${alertId}/resolve`);
      // Update in-place
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: 'resolved' } : a))
      );
    } catch (err) {
      alert('Failed to resolve alert');
    }
  };

  const formatType = (type) => {
    switch (type) {
      case 'blacklisted_vehicle':
        return 'Blacklisted vehicle';
      case 'camera_fault':
        return 'Camera offline';
      case 'wrong_way':
        return 'Wrong way';
      case 'speeding':
        return 'Speeding';
      default:
        return type?.replace(/_/g, ' ') || 'Alert';
    }
  };

  return (
    <PageWrapper
      title="Alerts Audit Log"
      subtitle="Comprehensive security alerts, restricted vehicle triggers, and camera faults"
      fullWidth
      actions={
        <div className="flex items-center gap-3">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#888888] font-ui">
            <Filter size={13} strokeWidth={1.5} />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#242424] border border-[#2A2A2A] rounded px-2.5 py-1 text-[#F0F0F0] focus:outline-none focus:border-[#3D3D3D]"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="resolved">Resolved Only</option>
            </select>
          </div>

          {/* Severity filter */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#888888] font-ui">
            <span>Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#242424] border border-[#2A2A2A] rounded px-2.5 py-1 text-[#F0F0F0] focus:outline-none focus:border-[#3D3D3D]"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
            </select>
          </div>
        </div>
      }
    >
      <div className="border border-[#2A2A2A] rounded-[6px] overflow-hidden bg-[#161616]">
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Severity</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Camera / Sector</TableHeader>
              <TableHeader>Plate Number</TableHeader>
              <TableHeader mono>Time</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader className="text-right">Action</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeletonRows columns={7} rows={6} />
            ) : alerts.length > 0 ? (
              alerts.map((a) => {
                const isResolved = a.status === 'resolved';

                return (
                  <TableRow key={a.id} isResolved={isResolved}>
                    <TableCell>
                      <AlertBadge severity={a.severity} />
                    </TableCell>
                    <TableCell className="font-medium text-[#F0F0F0]">
                      {formatType(a.type)}
                    </TableCell>
                    <TableCell>
                      <span className="font-data text-[#F0F0F0]">{a.camera_id || 'System'}</span>
                      <span className="text-[#888888] text-[12px] ml-2">
                        {a.camera_label || 'Chandigarh Central'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {a.plate_number ? (
                        <PlateTag plate={a.plate_number} />
                      ) : (
                        <span className="text-[#555555] font-data text-[12px]">—</span>
                      )}
                    </TableCell>
                    <TableCell mono className="text-[#888888] text-[12px]">
                      {formatISTTime(a.created_at, true)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-[12px] font-medium capitalize font-ui ${
                          isResolved ? 'text-[#888888]' : 'text-[#EF4444]'
                        }`}
                      >
                        {a.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {!isResolved ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolve(a.id)}
                          className="h-7 text-[11px]"
                        >
                          <Check size={12} strokeWidth={1.5} className="mr-1" />
                          Resolve
                        </Button>
                      ) : (
                        <span className="text-[12px] text-[#555555] font-data">
                          Resolved
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8">
                  <EmptyState
                    icon={Bell}
                    title="No alerts matching filter"
                    description="No system security alerts match the selected status and severity parameters."
                  />
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </PageWrapper>
  );
}
