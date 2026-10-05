// JARVIS App — MarketingTemplatesDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMarketingTemplates, deleteMarketingTemplates } from '@/lib/apiClient';
import type { MarketingTemplateResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Field = { key: string; label: string; render: (r: MarketingTemplateResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "name", label: "Name", render: (r) => fmtValue("name", r.name) },
  { key: "category", label: "Category", render: (r) => fmtValue("category", r.category) },
  { key: "template_type", label: "Template Type", render: (r) => fmtValue("template_type", r.template_type) },
  { key: "content_html", label: "Content Html", render: (r) => fmtValue("content_html", r.content_html) },
  { key: "thumbnail_url", label: "Thumbnail Url", render: (r) => fmtValue("thumbnail_url", r.thumbnail_url) },
  { key: "is_active", label: "Is Active", render: (r) => fmtValue("is_active", r.is_active) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function MarketingTemplatesDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteMarketingTemplates(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing_templates"] });
      navigate("/marketing-templates");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["marketing_templates", recordId],
    queryFn: () => getMarketingTemplates(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Marketing Templates</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: MarketingTemplateResponse = data;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Marketing Templates #{String(record.id ?? '')}</h1>
        <div className="flex space-x-2">
          <Link to="/marketing-templates" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/marketing-templates/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
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
