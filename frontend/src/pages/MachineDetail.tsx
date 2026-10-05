// JARVIS App — MachineDetail (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getMachines } from '@/lib/apiClient';
import type { MachineResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';

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

export default function MachineDetail() {
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);

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
        <h1 className="text-2xl font-bold">Machines #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/machines" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
        </div>
      </div>
      <dl className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {FIELDS.map((f: Field) => (
          <div key={f.key} className="grid grid-cols-3 gap-4 px-6 py-3">
            <dt className="text-sm font-medium text-gray-500">{f.label}</dt>
            <dd className="col-span-2 text-sm text-gray-900 break-words">{f.render(record)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
