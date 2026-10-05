// JARVIS App — RoutesDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRoutes, deleteRoutes, createRoutesOptimize } from '@/lib/apiClient';
import type { RouteResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

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

type Field = { key: string; label: string; render: (r: RouteResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "operator_id", label: "Operator Id", render: (r) => fmtValue("operator_id", r.operator_id) },
  { key: "driver_id", label: "Driver Id", render: (r) => fmtValue("driver_id", r.driver_id) },
  { key: "name", label: "Name", render: (r) => fmtValue("name", r.name) },
  { key: "status", label: "Status", render: (r) => fmtValue("status", r.status) },
  { key: "scheduled_date", label: "Scheduled Date", render: (r) => fmtValue("scheduled_date", r.scheduled_date) },
  { key: "started_at", label: "Started At", render: (r) => fmtValue("started_at", r.started_at) },
  { key: "completed_at", label: "Completed At", render: (r) => fmtValue("completed_at", r.completed_at) },
  { key: "machine_ids_json", label: "Machine Ids Json", render: (r) => fmtValue("machine_ids_json", r.machine_ids_json) },
  { key: "optimized_order_json", label: "Optimized Order Json", render: (r) => fmtValue("optimized_order_json", r.optimized_order_json) },
  { key: "total_distance_miles", label: "Total Distance Miles", render: (r) => fmtValue("total_distance_miles", r.total_distance_miles) },
  { key: "notes", label: "Notes", render: (r) => fmtValue("notes", r.notes) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function RoutesDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteRoutes(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      navigate("/routes");
    },
  });
  const optimizeMut = useMutation({
    mutationFn: () => createRoutesOptimize(recordId),
    onSuccess: (data) => { queryClient.invalidateQueries({ queryKey: ["routes", recordId] }); queryClient.invalidateQueries({ queryKey: ["routes"] }); toast.success('Optimize complete' + (_actionResult(data) ? ' \u2014 ' + _actionResult(data) : '')); },
    onError: (err) => { toast.error(_errMsg(err)); },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["routes", recordId],
    queryFn: () => getRoutes(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Routes</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: RouteResponse = data;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Route #{String(record.id ?? '')}</h1>
        <div className="flex space-x-2">
          <Link to="/routes" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/routes/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
          <button onClick={() => { if (window.confirm('Delete this record?')) del.mutate(); }} disabled={del.isPending} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{del.isPending ? 'Deleting\u2026' : 'Delete'}</button>
          <button onClick={() => { if (window.confirm('Optimize — are you sure?')) optimizeMut.mutate(); }} disabled={optimizeMut.isPending} className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{optimizeMut.isPending ? 'Optimize\u2026' : 'Optimize'}</button>
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
