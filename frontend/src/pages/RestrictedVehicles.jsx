import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeletonRows } from '../components/ui/Table';
import PlateTag from '../components/plates/PlateTag';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import api from '../lib/api';
import { formatISTTime } from '../lib/utils';
import { ShieldAlert, Plus, Trash2, AlertTriangle } from 'lucide-react';

export default function RestrictedVehicles() {
  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newReason, setNewReason] = useState('');
  const [addError, setAddError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Remove confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetItem, setTargetItem] = useState(null);

  const fetchBlacklist = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/blacklist');
      setBlacklist(res.data || []);
    } catch (err) {
      // Keep existing
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newPlate.trim() || !newReason.trim()) return;

    setSubmitting(true);
    setAddError('');

    try {
      const res = await api.post('/api/blacklist', {
        plate_number: newPlate.trim().toUpperCase(),
        reason: newReason.trim(),
      });

      setBlacklist((prev) => [res.data, ...prev]);
      setAddModalOpen(false);
      setNewPlate('');
      setNewReason('');
    } catch (err) {
      setAddError(err.response?.data?.detail || 'Failed to add restricted vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!targetItem) return;

    try {
      await api.delete(`/api/blacklist/${targetItem.id}`);
      setBlacklist((prev) => prev.filter((item) => item.id !== targetItem.id));
      setDeleteModalOpen(false);
      setTargetItem(null);
    } catch (err) {
      alert('Failed to remove entry from restricted list');
    }
  };

  return (
    <PageWrapper
      title="Restricted Vehicles (Blacklist)"
      subtitle="Vehicles flagged for impoundment, criminal warrants, FIR investigations, or theft"
      fullWidth
      actions={
        <Button
          variant="primary"
          size="md"
          onClick={() => setAddModalOpen(true)}
          className="h-8"
        >
          <Plus size={14} strokeWidth={1.5} className="mr-1" />
          Add vehicle
        </Button>
      }
    >
      <div className="border border-[#2A2A2A] rounded-[6px] overflow-hidden bg-[#161616]">
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Plate Number</TableHeader>
              <TableHeader>Flag Reason / Case Reference</TableHeader>
              <TableHeader>Added By</TableHeader>
              <TableHeader mono>Date Added (IST)</TableHeader>
              <TableHeader className="text-right">Action</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableSkeletonRows columns={5} rows={6} />
            ) : blacklist.length > 0 ? (
              blacklist.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <PlateTag plate={item.plate_number} />
                  </TableCell>
                  <TableCell className="text-[#F0F0F0] max-w-md">
                    {item.reason}
                  </TableCell>
                  <TableCell className="text-[#888888]">
                    {item.added_by_name || 'Admin'}
                  </TableCell>
                  <TableCell mono className="text-[#888888] text-[12px]">
                    {formatISTTime(item.added_at, true)}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => {
                        setTargetItem(item);
                        setDeleteModalOpen(true);
                      }}
                      className="text-[12px] font-medium text-[#EF4444] hover:underline font-ui inline-flex items-center gap-1"
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                      Remove
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8">
                  <EmptyState
                    icon={ShieldAlert}
                    title="No restricted vehicles"
                    description="The restricted vehicle blacklist is currently clear."
                  />
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Vehicle to Restricted List"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            mono
            label="Plate Number"
            placeholder="e.g. CH01AB9999"
            value={newPlate}
            onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
            required
            autoFocus
          />

          <Input
            label="Reason / Case Reference"
            placeholder="e.g. Stolen vehicle — FIR No. 0411/2025, PS Sector 34"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            required
          />

          {addError && (
            <div className="text-[12px] text-[#EF4444] font-ui">{addError}</div>
          )}

          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={submitting || !newPlate.trim() || !newReason.trim()}
            >
              {submitting ? 'Adding...' : 'Add to List'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Removal"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} strokeWidth={1.5} className="text-[#EF4444] shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#F0F0F0] leading-relaxed">
              Remove vehicle{' '}
              <span className="font-data font-semibold text-[#3E7BFA]">
                {targetItem?.plate_number}
              </span>{' '}
              from the restricted surveillance list?
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              type="button"
              onClick={handleConfirmDelete}
            >
              Confirm Remove
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
