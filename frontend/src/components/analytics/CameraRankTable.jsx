import React from 'react';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table';
import StatusDot from '../ui/StatusDot';

export default function CameraRankTable({ cameras = [] }) {
  return (
    <div className="w-full h-[260px] overflow-y-auto border border-[#2A2A2A] rounded-[4px] bg-[#161616]">
      <Table>
        <TableHead>
          <tr>
            <TableHeader>Camera</TableHeader>
            <TableHeader>Sector</TableHeader>
            <TableHeader mono>Reads</TableHeader>
            <TableHeader>Status</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {cameras.length > 0 ? (
            cameras.map((c, idx) => (
              <TableRow key={c.camera_id || idx}>
                <TableCell mono className="text-[#3E7BFA]">
                  {c.camera_id}
                </TableCell>
                <TableCell className="text-[#888888] text-[12px] truncate max-w-[140px]">
                  {c.sector || c.camera_label}
                </TableCell>
                <TableCell mono className="font-semibold text-[#F0F0F0]">
                  {c.read_count?.toLocaleString('en-IN')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={c.status} size="sm" pulse={c.status === 'active'} />
                    <span className="capitalize text-[11px] text-[#888888]">
                      {c.status}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-8 text-center text-[#888888] text-[12px] font-ui">
                No activity data loaded
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

