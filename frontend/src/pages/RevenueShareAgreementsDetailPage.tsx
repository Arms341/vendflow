// JARVIS App — RevenueShareAgreementsDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRevenueShareAgreements, deleteRevenueShareAgreements } from '@/lib/apiClient';
import type { RevenueShareAgreementResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Field = { key: string; label: string; render: (r: RevenueShareAgreementResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "operator_id", label: "Operator Id", render: (r) => fmtValue("operator_id", r.operator_id) },
  { key: "landowner_id", label: "Landowner Id", render: (r) => fmtValue("landowner_id", r.landowner_id) },
  { key: "location_id", label: "Location Id", render: (r) => fmtValue("location_id", r.location_id) },
  { key: "machine_id", label: "Machine Id", render: (r) => fmtValue("machine_id", r.machine_id) },
  { key: "share_type", label: "Share Type", render: (r) => fmtValue("share_type", r.share_type) },
  { key: "share_rate", label: "Share Rate", render: (r) => fmtValue("share_rate", r.share_rate) },
  { key: "minimum_guarantee", label: "Minimum Guarantee", render: (r) => fmtValue("minimum_guarantee", r.minimum_guarantee) },
  { key: "effective_date", label: "Effective Date", render: (r) => fmtValue("effective_date", r.effective_date) },
  { key: "end_date", label: "End Date", render: (r) => fmtValue("end_date", r.end_date) },
  { key: "status", label: "Status", render: (r) => fmtValue("status", r.status) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function RevenueShareAgreementsDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteRevenueShareAgreements(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue_share_agreements"] });
      navigate("/revenue-share-agreements");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["revenue_share_agreements", recordId],
    queryFn: () => getRevenueShareAgreements(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Revenue Share Agreements</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: RevenueShareAgreementResponse = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Revenue Share Agreements #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/revenue-share-agreements" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/revenue-share-agreements/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
          <button onClick={() => { if (window.confirm('Delete this record?')) del.mutate(); }} disabled={del.isPending} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{del.isPending ? 'Deleting\u2026' : 'Delete'}</button>
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
    </div>
  );
}
