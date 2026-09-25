import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import PlateTag from '../components/plates/PlateTag';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { formatISTTime } from '../lib/utils';
import { ShieldAlert, Plus, Trash2, AlertTriangle, User, CarFront } from 'lucide-react';

const INITIAL_BLACKLIST = [
  { id: '1', plate_number: 'PB10AB1234', category: 'Stolen', reason: 'FIR No. 0411/2025, PS Sector 34', added_by_name: 'Admin', added_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '2', plate_number: 'HR26BN0093', category: 'Wanted', reason: 'Suspected involvement in hit & run', added_by_name: 'System', added_at: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: '3', plate_number: 'CH01AB7654', category: 'VIP', reason: 'Chief Minister Escort Vehicle', added_by_name: 'Admin', added_at: new Date(Date.now() - 86400000 * 5).toISOString() }
];

export default function RestrictedVehicles() {
  const [blacklist, setBlacklist] = useState(INITIAL_BLACKLIST);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newCategory, setNewCategory] = useState('Stolen');
  const [newReason, setNewReason] = useState('');
  
  // Remove confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetItem, setTargetItem] = useState(null);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newPlate.trim() || !newReason.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      plate_number: newPlate.trim().toUpperCase(),
      category: newCategory,
      reason: newReason.trim(),
      added_by_name: 'Operator',
      added_at: new Date().toISOString()
    };

    setBlacklist([newItem, ...blacklist]);
    setAddModalOpen(false);
    setNewPlate('');
    setNewReason('');
    setNewCategory('Stolen');
  };

  const handleConfirmDelete = () => {
    if (!targetItem) return;
    setBlacklist(blacklist.filter((item) => item.id !== targetItem.id));
    setDeleteModalOpen(false);
    setTargetItem(null);
  };

  const getCategoryStyle = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'stolen': return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30';
      case 'wanted': return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30';
      case 'vip': return 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30';
      default: return 'bg-[#888888]/10 text-[#888888] border-[#888888]/30';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'stolen': return <CarFront size={11} />;
      case 'wanted': return <ShieldAlert size={11} />;
      case 'vip': return <User size={11} />;
      default: return <ShieldAlert size={11} />;
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
              <TableHeader>Category</TableHeader>
              <TableHeader>Flag Reason / Case Reference</TableHeader>
              <TableHeader>Added By</TableHeader>
              <TableHeader mono>Date Added (IST)</TableHeader>
              <TableHeader className="text-right">Action</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {blacklist.length > 0 ? (
              blacklist.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <PlateTag plate={item.plate_number} />
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border text-[11px] font-bold uppercase tracking-wider ${getCategoryStyle(item.category)}`}>
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#F0F0F0] max-w-md">
                    {item.reason}
                  </TableCell>
                  <TableCell className="text-[#888888]">
                    {item.added_by_name}
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
                <td colSpan={6} className="p-8">
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

          <div className="space-y-1.5">
            <label className="block text-[12px] font-medium text-[#888888] font-ui">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-[14px] text-[#F0F0F0] focus:outline-none focus:border-[#3E7BFA] font-ui"
            >
              <option value="Stolen">Stolen</option>
              <option value="Wanted">Wanted</option>
              <option value="VIP">VIP</option>
              <option value="Suspicious">Suspicious</option>
            </select>
          </div>

          <Input
            label="Reason / Case Reference"
            placeholder="e.g. Stolen vehicle — FIR No. 0411/2025, PS Sector 34"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            required
          />

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
              disabled={!newPlate.trim() || !newReason.trim()}
            >
              Add to List
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
