import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { usePlateSearch } from '../hooks/usePlateSearch';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import StatusDot from '../components/ui/StatusDot';
import ConfidencePill from '../components/plates/ConfidencePill';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { formatISTTime } from '../lib/utils';
import { Search, ShieldAlert, AlertTriangle, FileText } from 'lucide-react';

export default function PlateSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const { result, loading, error, search } = usePlateSearch();

  // Read plate from URL query param if present
  useEffect(() => {
    const initialPlate = searchParams.get('plate');
    if (initialPlate) {
      setQuery(initialPlate);
      search(initialPlate);
    }
  }, [searchParams]);

  const handleLookup = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ plate: query.trim() });
    search(query.trim());
  };

  return (
    <PageWrapper
      title="Plate Search & RTO Lookup"
      subtitle="Query license plate database for RTO ownership records and camera sightings"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="bg-[#161616] border border-[#2A2A2A] rounded-[6px] p-5">
          <form onSubmit={handleLookup} className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  mono
                  value={query}
                  onChange={(e) => setQuery(e.target.value.toUpperCase())}
                  placeholder="Enter plate number — e.g. PB10AB1234"
                  className="text-[16px] uppercase tracking-wider py-2.5 px-3.5"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !query.trim()}
                className="px-6"
              >
                {loading ? 'Searching...' : 'Look up'}
              </Button>
            </div>
            <p className="text-[11px] text-[#555555] font-ui">
              Search is case-insensitive. Partial matches not supported.
            </p>
          </form>
        </div>

        {/* Search Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Panel 1: RTO Registration Record */}
            <div className="bg-[#161616] border border-[#2A2A2A] rounded-[6px] overflow-hidden">
              {/* Blacklist Warning Banner */}
              {result.blacklist_entry && (
                <div className="bg-[#2A1010] border-b border-[#EF4444]/40 p-3.5 flex items-start gap-2.5">
                  <ShieldAlert size={18} strokeWidth={1.5} className="text-[#EF4444] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[13px] font-semibold text-[#EF4444] font-ui">
                      Restricted Vehicle Alert
                    </div>
                    <div className="text-[12px] text-[#F0F0F0] mt-0.5 font-ui">
                      {result.blacklist_entry.reason}
                    </div>
                  </div>
                </div>
              )}

              {/* RTO Content */}
              <div className="p-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
                  <div>
                    <span className="text-[20px] font-bold font-data text-[#F0F0F0] tracking-wide">
                      {result.plate_number}
                    </span>
                    <span className="text-[12px] text-[#888888] ml-3 font-ui">
                      Registered Owner
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#888888]">
                    <StatusDot
                      status={result.rto?.status === 'active' ? 'active' : 'fault'}
                      size="sm"
                    />
                    <span className="capitalize">{result.rto?.status || 'Unknown'}</span>
                  </div>
                </div>

                {result.rto ? (
                  <div className="mt-4 space-y-3">
                    <div className="text-[16px] font-semibold text-[#F0F0F0] font-ui">
                      {result.rto.owner_name}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 pt-2 text-[13px] font-ui">
                      <div className="flex justify-between py-1 border-b border-[#2A2A2A]/40">
                        <span className="text-[#888888]">Vehicle Make</span>
                        <span className="text-[#F0F0F0] font-medium">
                          {result.rto.vehicle_make} {result.rto.vehicle_model}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#2A2A2A]/40">
                        <span className="text-[#888888]">Color / State</span>
                        <span className="text-[#F0F0F0]">
                          {result.rto.vehicle_color}, {result.rto.registration_state}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#2A2A2A]/40">
                        <span className="text-[#888888]">Registration Year</span>
                        <span className="text-[#F0F0F0] font-data">
                          {result.rto.registration_year}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#2A2A2A]/40">
                        <span className="text-[#888888]">Chassis No.</span>
                        <span className="text-[#F0F0F0] font-data text-[12px]">
                          {result.rto.chassis_number || '—'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#2A2A2A]/40 sm:col-span-2">
                        <span className="text-[#888888]">Insurance Validity</span>
                        <span
                          className={`font-data ${
                            result.rto.status === 'expired'
                              ? 'text-[#EF4444]'
                              : 'text-[#22C55E]'
                          }`}
                        >
                          {result.rto.insurance_valid_until
                            ? `Valid until ${result.rto.insurance_valid_until}`
                            : 'Valid'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-[13px] text-[#888888] font-ui">
                    No registration record found for this plate.
                  </div>
                )}
              </div>
            </div>

            {/* Panel 2: Sighting History */}
            <div className="bg-[#161616] border border-[#2A2A2A] rounded-[6px] overflow-hidden p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-medium text-[#F0F0F0] font-ui">
                    Sighting History
                  </h3>
                  <p className="text-[12px] text-[#888888] font-ui">
                    Sensor captures recorded for this vehicle
                  </p>
                </div>
                <span className="text-[11px] font-data text-[#888888] bg-[#1E1E1E] px-2 py-0.5 rounded">
                  {result.events.length} Sightings
                </span>
              </div>

              {result.events.length > 0 ? (
                <div className="border border-[#2A2A2A] rounded overflow-hidden">
                  <Table>
                    <TableHead>
                      <tr>
                        <TableHeader mono>Camera</TableHeader>
                        <TableHeader>Sector</TableHeader>
                        <TableHeader mono>Date & Time (IST)</TableHeader>
                        <TableHeader>Confidence</TableHeader>
                      </tr>
                    </TableHead>
                    <TableBody>
                      {result.events.map((ev) => (
                        <TableRow key={ev.id}>
                          <TableCell mono className="text-[#3E7BFA]">
                            {ev.camera_id}
                          </TableCell>
                          <TableCell className="text-[#888888]">
                            {ev.sector || ev.camera_label}
                          </TableCell>
                          <TableCell mono className="text-[#888888] text-[12px]">
                            {formatISTTime(ev.event_time, true)}
                          </TableCell>
                          <TableCell>
                            <ConfidencePill confidence={ev.confidence} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-[#888888] text-[13px] font-ui border border-dashed border-[#2A2A2A] rounded-[4px]">
                  No sightings in the current dataset. The vehicle may not have been captured during the demo window.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
