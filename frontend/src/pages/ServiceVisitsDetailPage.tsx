// JARVIS App — ServiceVisitsDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getServiceVisits, deleteServiceVisits } from '@/lib/apiClient';
import type { ServiceVisitResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Field = { key: string; label: string; render: (r: ServiceVisitResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "machine_id", label: "Machine Id", render: (r) => fmtValue("machine_id", r.machine_id) },
  { key: "driver_id", label: "Driver Id", render: (r) => fmtValue("driver_id", r.driver_id) },
  { key: "route_id", label: "Route Id", render: (r) => fmtValue("route_id", r.route_id) },
  { key: "visit_type", label: "Visit Type", render: (r) => fmtValue("visit_type", r.visit_type) },
  { key: "started_at", label: "Started At", render: (r) => fmtValue("started_at", r.started_at) },
  { key: "completed_at", label: "Completed At", render: (r) => fmtValue("completed_at", r.completed_at) },
  { key: "notes", label: "Notes", render: (r) => fmtValue("notes", r.notes) },
  { key: "cash_collected", label: "Cash Collected", render: (r) => fmtValue("cash_collected", r.cash_collected) },
  { key: "products_restocked_json", label: "Products Restocked Json", render: (r) => fmtValue("products_restocked_json", r.products_restocked_json) },
  { key: "issues_found_json", label: "Issues Found Json", render: (r) => fmtValue("issues_found_json", r.issues_found_json) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
];

export default function ServiceVisitsDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteServiceVisits(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_visits"] });
      navigate("/service-visits");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["service_visits", recordId],
    queryFn: () => getServiceVisits(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Service Visits</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: ServiceVisitResponse = data;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Service Visits #{String(record.id ?? '')}</h1>
        <div className="flex space-x-2">
          <Link to="/service-visits" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/service-visits/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
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
