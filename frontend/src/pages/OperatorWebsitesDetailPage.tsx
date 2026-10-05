// JARVIS App — OperatorWebsitesDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOperatorWebsites, deleteOperatorWebsites, createOperatorWebsitesPublish } from '@/lib/apiClient';
import type { OperatorWebsiteResponse } from '@/types/api';
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

type Field = { key: string; label: string; render: (r: OperatorWebsiteResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "operator_id", label: "Operator Id", render: (r) => fmtValue("operator_id", r.operator_id) },
  { key: "domain", label: "Domain", render: (r) => fmtValue("domain", r.domain) },
  { key: "subdomain", label: "Subdomain", render: (r) => fmtValue("subdomain", r.subdomain) },
  { key: "company_name", label: "Company Name", render: (r) => fmtValue("company_name", r.company_name) },
  { key: "tagline", label: "Tagline", render: (r) => fmtValue("tagline", r.tagline) },
  { key: "logo_url", label: "Logo Url", render: (r) => fmtValue("logo_url", r.logo_url) },
  { key: "primary_color", label: "Primary Color", render: (r) => fmtValue("primary_color", r.primary_color) },
  { key: "phone", label: "Phone", render: (r) => fmtValue("phone", r.phone) },
  { key: "email", label: "Email", render: (r) => fmtValue("email", r.email) },
  { key: "about_text", label: "About Text", render: (r) => fmtValue("about_text", r.about_text) },
  { key: "services_json", label: "Services Json", render: (r) => fmtValue("services_json", r.services_json) },
  { key: "chatbot_enabled", label: "Chatbot Enabled", render: (r) => fmtValue("chatbot_enabled", r.chatbot_enabled) },
  { key: "chatbot_greeting", label: "Chatbot Greeting", render: (r) => fmtValue("chatbot_greeting", r.chatbot_greeting) },
  { key: "is_published", label: "Is Published", render: (r) => fmtValue("is_published", r.is_published) },
  { key: "template_id", label: "Template Id", render: (r) => fmtValue("template_id", r.template_id) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function OperatorWebsitesDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteOperatorWebsites(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operator_websites"] });
      navigate("/operator-websites");
    },
  });
  const publishMut = useMutation({
    mutationFn: () => createOperatorWebsitesPublish(recordId),
    onSuccess: (data) => { queryClient.invalidateQueries({ queryKey: ["operator_websites", recordId] }); queryClient.invalidateQueries({ queryKey: ["operator_websites"] }); toast.success('Publish complete' + (_actionResult(data) ? ' \u2014 ' + _actionResult(data) : '')); },
    onError: (err) => { toast.error(_errMsg(err)); },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["operator_websites", recordId],
    queryFn: () => getOperatorWebsites(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Operator Websites</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: OperatorWebsiteResponse = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Operator Websites #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/operator-websites" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/operator-websites/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
          <button onClick={() => { if (window.confirm('Delete this record?')) del.mutate(); }} disabled={del.isPending} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{del.isPending ? 'Deleting\u2026' : 'Delete'}</button>
          <button onClick={() => { if (window.confirm('Publish — are you sure?')) publishMut.mutate(); }} disabled={publishMut.isPending} className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{publishMut.isPending ? 'Publish\u2026' : 'Publish'}</button>
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
