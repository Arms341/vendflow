// JARVIS App — LeadsDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLeads, deleteLeads } from '@/lib/apiClient';
import type { LeadResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Field = { key: string; label: string; render: (r: LeadResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "operator_id", label: "Operator Id", render: (r) => fmtValue("operator_id", r.operator_id) },
  { key: "business_name", label: "Business Name", render: (r) => fmtValue("business_name", r.business_name) },
  { key: "contact_name", label: "Contact Name", render: (r) => fmtValue("contact_name", r.contact_name) },
  { key: "contact_email", label: "Contact Email", render: (r) => fmtValue("contact_email", r.contact_email) },
  { key: "contact_phone", label: "Contact Phone", render: (r) => fmtValue("contact_phone", r.contact_phone) },
  { key: "address", label: "Address", render: (r) => fmtValue("address", r.address) },
  { key: "city", label: "City", render: (r) => fmtValue("city", r.city) },
  { key: "state", label: "State", render: (r) => fmtValue("state", r.state) },
  { key: "zip_code", label: "Zip Code", render: (r) => fmtValue("zip_code", r.zip_code) },
  { key: "latitude", label: "Latitude", render: (r) => fmtValue("latitude", r.latitude) },
  { key: "longitude", label: "Longitude", render: (r) => fmtValue("longitude", r.longitude) },
  { key: "business_type", label: "Business Type", render: (r) => fmtValue("business_type", r.business_type) },
  { key: "status", label: "Status", render: (r) => fmtValue("status", r.status) },
  { key: "source", label: "Source", render: (r) => fmtValue("source", r.source) },
  { key: "notes", label: "Notes", render: (r) => fmtValue("notes", r.notes) },
  { key: "next_follow_up_at", label: "Next Follow Up At", render: (r) => fmtValue("next_follow_up_at", r.next_follow_up_at) },
  { key: "mockup_image_url", label: "Mockup Image Url", render: (r) => fmtValue("mockup_image_url", r.mockup_image_url) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function LeadsDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteLeads(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      navigate("/leads");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["leads", recordId],
    queryFn: () => getLeads(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Leads</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: LeadResponse = data;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lead #{String(record.id ?? '')}</h1>
        <div className="flex space-x-2">
          <Link to="/leads" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/leads/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
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
