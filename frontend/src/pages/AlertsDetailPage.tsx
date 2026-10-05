// JARVIS App — AlertsDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAlerts, deleteAlerts } from '@/lib/apiClient';
import type { AlertResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Field = { key: string; label: string; render: (r: AlertResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "machine_id", label: "Machine Id", render: (r) => fmtValue("machine_id", r.machine_id) },
  { key: "alert_type", label: "Alert Type", render: (r) => fmtValue("alert_type", r.alert_type) },
  { key: "severity", label: "Severity", render: (r) => fmtValue("severity", r.severity) },
  { key: "message", label: "Message", render: (r) => fmtValue("message", r.message) },
  { key: "is_acknowledged", label: "Is Acknowledged", render: (r) => fmtValue("is_acknowledged", r.is_acknowledged) },
  { key: "acknowledged_by", label: "Acknowledged By", render: (r) => fmtValue("acknowledged_by", r.acknowledged_by) },
  { key: "acknowledged_at", label: "Acknowledged At", render: (r) => fmtValue("acknowledged_at", r.acknowledged_at) },
  { key: "resolved_at", label: "Resolved At", render: (r) => fmtValue("resolved_at", r.resolved_at) },
  { key: "data_json", label: "Data Json", render: (r) => fmtValue("data_json", r.data_json) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
];

export default function AlertsDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteAlerts(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      navigate("/alerts");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["alerts", recordId],
    queryFn: () => getAlerts(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Alerts</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: AlertResponse = data;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Alert #{String(record.id ?? '')}</h1>
        <div className="flex space-x-2">
          <Link to="/alerts" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/alerts/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
          <button onClick={() => { if (window.confirm('Delete this record?')) del.mutate(); }} disabled={del.isPending} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{del.isPending ? 'Deleting\u2026' : 'Delete'}</button>
        </div>
      </div>
      <dl className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {FIELDS.map((f: Field) => (
          <div key={f.key} className="grid grid-cols-3 gap-4 px-6 py-3">
            <dt className="text-sm font-medium text-gray-500">
              {f.key.endsWith('_id') && f.key !== 'id' ? f.label.replace(/ Id$/, '') : f.label}
            </dt>
            <dd className="col-span-2 text-sm text-gray-900 break-words">
              {(f.key.endsWith('_id') && f.key !== 'id'
                ? refLabel(f.key, (record as Record<string, unknown>)[f.key])
                : null) ?? f.render(record)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
