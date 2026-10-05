// JARVIS App — LandownersDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLandowners, deleteLandowners } from '@/lib/apiClient';
import type { LandownerResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Field = { key: string; label: string; render: (r: LandownerResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "operator_id", label: "Operator Id", render: (r) => fmtValue("operator_id", r.operator_id) },
  { key: "name", label: "Name", render: (r) => fmtValue("name", r.name) },
  { key: "business_name", label: "Business Name", render: (r) => fmtValue("business_name", r.business_name) },
  { key: "contact_name", label: "Contact Name", render: (r) => fmtValue("contact_name", r.contact_name) },
  { key: "contact_email", label: "Contact Email", render: (r) => fmtValue("contact_email", r.contact_email) },
  { key: "contact_phone", label: "Contact Phone", render: (r) => fmtValue("contact_phone", r.contact_phone) },
  { key: "address", label: "Address", render: (r) => fmtValue("address", r.address) },
  { key: "city", label: "City", render: (r) => fmtValue("city", r.city) },
  { key: "state", label: "State", render: (r) => fmtValue("state", r.state) },
  { key: "zip_code", label: "Zip Code", render: (r) => fmtValue("zip_code", r.zip_code) },
  { key: "tax_id_last_four", label: "Tax Id Last Four", render: (r) => fmtValue("tax_id_last_four", r.tax_id_last_four) },
  { key: "payout_method", label: "Payout Method", render: (r) => fmtValue("payout_method", r.payout_method) },
  { key: "payout_token_ref", label: "Payout Token Ref", render: (r) => fmtValue("payout_token_ref", r.payout_token_ref) },
  { key: "payout_last_four", label: "Payout Last Four", render: (r) => fmtValue("payout_last_four", r.payout_last_four) },
  { key: "status", label: "Status", render: (r) => fmtValue("status", r.status) },
  { key: "is_active", label: "Is Active", render: (r) => fmtValue("is_active", r.is_active) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function LandownersDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteLandowners(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landowners"] });
      navigate("/landowners");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["landowners", recordId],
    queryFn: () => getLandowners(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Landowners</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: LandownerResponse = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Landowner #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/landowners" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/landowners/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
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
