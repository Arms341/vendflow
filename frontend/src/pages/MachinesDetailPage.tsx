// JARVIS App — MachinesDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMachines, deleteMachines, createMachinesTelemetry } from '@/lib/apiClient';
import type { MachineResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';
import TerminalPanel from '@/components/TerminalPanel';   // S204: the terminal, from HQ

const _errMsg = (e: unknown): string => {
  const x = e as { response?: { data?: { detail?: unknown } }; message?: string };
  const d = x?.response?.data?.detail;
  if (typeof d === 'string') return d;
  if (typeof x?.message === 'string') return x.message;
  return 'Something went wrong';
};
const _actionResult = (r: unknown): string => {
  if (r && typeof r === 'object') {
    const o = r as Record<string, unknown>;
    for (const k of ['created', 'ran', 'updated', 'processed', 'count']) {
      if (typeof o[k] === 'number') return String(o[k]);
    }
    if (typeof o.id === 'number') return '#' + String(o.id);
  }
  return '';
};

type Field = { key: string; label: string; render: (r: MachineResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "serial_number", label: "Serial Number", render: (r) => fmtValue("serial_number", r.serial_number) },
  { key: "machine_type", label: "Machine Type", render: (r) => fmtValue("machine_type", r.machine_type) },
  { key: "name", label: "Name", render: (r) => fmtValue("name", r.name) },
  { key: "manufacturer", label: "Manufacturer", render: (r) => fmtValue("manufacturer", r.manufacturer) },
  { key: "model", label: "Model", render: (r) => fmtValue("model", r.model) },
  { key: "status", label: "Status", render: (r) => fmtValue("status", r.status) },
  { key: "operator_id", label: "Operator Id", render: (r) => fmtValue("operator_id", r.operator_id) },
  { key: "location_id", label: "Location Id", render: (r) => fmtValue("location_id", r.location_id) },
  { key: "terminal_id", label: "Terminal Id", render: (r) => fmtValue("terminal_id", r.terminal_id) },
  { key: "pi_device_id", label: "Pi Device ID", render: (r) => fmtValue("pi_device_id", r.pi_device_id) },
  { key: "sim_iccid", label: "SIM ICCID", render: (r) => fmtValue("sim_iccid", r.sim_iccid) },
  { key: "firmware_version", label: "Firmware Version", render: (r) => fmtValue("firmware_version", r.firmware_version) },
  { key: "temperature", label: "Temperature", render: (r) => fmtValue("temperature", r.temperature) },
  { key: "is_online", label: "Is Online", render: (r) => fmtValue("is_online", r.is_online) },
  { key: "is_active", label: "Is Active", render: (r) => fmtValue("is_active", r.is_active) },
  { key: "last_service_at", label: "Last Service At", render: (r) => fmtValue("last_service_at", r.last_service_at) },
  { key: "last_restock_at", label: "Last Restock At", render: (r) => fmtValue("last_restock_at", r.last_restock_at) },
  { key: "last_telemetry_at", label: "Last Telemetry At", render: (r) => fmtValue("last_telemetry_at", r.last_telemetry_at) },
  { key: "installed_at", label: "Installed At", render: (r) => fmtValue("installed_at", r.installed_at) },
  { key: "edge_mode", label: "Edge Mode", render: (r) => fmtValue("edge_mode", r.edge_mode) },
  { key: "connectivity_type", label: "Connectivity Type", render: (r) => fmtValue("connectivity_type", r.connectivity_type) },
  { key: "card_markup_pct", label: "Card Markup %", render: (r) => fmtValue("card_markup_pct", r.card_markup_pct) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function MachinesDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteMachines(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      navigate("/machines");
    },
  });
  const [telemetryTemperature, setTelemetryTemperature] = useState<string>('');   // S204: starts empty, is labelled
  const telemetryMut = useMutation({
    mutationFn: () => createMachinesTelemetry(recordId, { temperature: Number(telemetryTemperature) }),
    onSuccess: (data) => { queryClient.invalidateQueries({ queryKey: ["machines", recordId] }); queryClient.invalidateQueries({ queryKey: ["machines"] }); toast.success('Telemetry complete' + (_actionResult(data) ? ' \u2014 ' + _actionResult(data) : '')); },
    onError: (err) => { toast.error(_errMsg(err)); },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["machines", recordId],
    queryFn: () => getMachines(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Machines</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: MachineResponse = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Machine #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/machines" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/machines/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
          <button onClick={() => { if (window.confirm('Delete this record?')) del.mutate(); }} disabled={del.isPending} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{del.isPending ? 'Deleting\u2026' : 'Delete'}</button>
          <label className="flex items-center gap-1.5 text-xs text-gray-500">Temperature
            <input type="number" aria-label="Temperature" placeholder="e.g. 28" value={telemetryTemperature} onChange={(e) => setTelemetryTemperature(e.target.value)} className="w-24 px-2 py-2 border border-gray-300 rounded-md text-sm text-gray-900" />
          </label>
          <button onClick={() => { if (window.confirm('Telemetry — are you sure?')) telemetryMut.mutate(); }} disabled={telemetryMut.isPending || telemetryTemperature === ''} title="Log a temperature reading for this machine" className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{telemetryMut.isPending ? 'Telemetry\u2026' : 'Telemetry'}</button>
        </div>
      </div>
      <dl className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {FIELDS.map((f: Field) => (
          <div key={f.key} className="grid grid-cols-5 md:grid-cols-3 gap-3 md:gap-4 px-4 md:px-6 py-3">
            <dt className="col-span-2 md:col-span-1 min-w-0 break-words text-sm font-medium text-gray-500">
              {f.key.endsWith('_id') && f.key !== 'id' ? f.label.replace(/ Id$/, '') : f.label}
            </dt>
            <dd className="col-span-3 md:col-span-2 min-w-0 text-sm text-gray-900 break-words">
              {(f.key.endsWith('_id') && f.key !== 'id'
                ? refLabel(f.key, (record as Record<string, unknown>)[f.key])
                : null) ?? f.render(record)}
            </dd>
          </div>
        ))}
      </dl>
      {record.terminal_id ? <TerminalPanel terminalId={String(record.terminal_id)} /> : null}
    </div>
  );
}
