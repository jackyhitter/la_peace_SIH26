import React from 'react';
import { TableRow, TableCell } from '../ui/Table';
import PlateTag from './PlateTag';
import ConfidencePill from './ConfidencePill';
import { formatISTTime } from '../../lib/utils';
import { ShieldAlert } from 'lucide-react';

export default function LogRow({ log }) {
  return (
    <TableRow>
      <TableCell>
        <PlateTag plate={log.plate_number} />
      </TableCell>
      <TableCell mono className="text-[#F0F0F0]">
        {log.camera_id}
      </TableCell>
      <TableCell className="text-[#888888]">
        {log.sector || log.camera_label}
      </TableCell>
      <TableCell mono className="text-[#888888] text-[12px]">
        {formatISTTime(log.event_time, true)}
      </TableCell>
      <TableCell>
        <ConfidencePill confidence={log.confidence} />
      </TableCell>
      <TableCell>
        {log.is_blacklisted ? (
          <span className="inline-flex items-center gap-1 text-[#EF4444] text-[12px] font-medium font-ui">
            <ShieldAlert size={14} strokeWidth={1.5} />
            Yes
          </span>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

