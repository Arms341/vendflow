// JARVIS App — ProductsDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProducts } from '@/lib/apiClient';
import type { ProductResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Field = { key: string; label: string; render: (r: ProductResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "operator_id", label: "Operator Id", render: (r) => fmtValue("operator_id", r.operator_id) },
  { key: "name", label: "Name", render: (r) => fmtValue("name", r.name) },
  { key: "sku", label: "Sku", render: (r) => fmtValue("sku", r.sku) },
  { key: "category", label: "Category", render: (r) => fmtValue("category", r.category) },
  { key: "unit_cost", label: "Unit Cost", render: (r) => fmtValue("unit_cost", r.unit_cost) },
  { key: "retail_price", label: "Retail Price", render: (r) => fmtValue("retail_price", r.retail_price) },
  { key: "par_level", label: "Par Level", render: (r) => fmtValue("par_level", r.par_level) },
  { key: "image_url", label: "Image Url", render: (r) => fmtValue("image_url", r.image_url) },
  { key: "is_active", label: "Is Active", render: (r) => fmtValue("is_active", r.is_active) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function ProductsDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteProducts(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", recordId],
    queryFn: () => getProducts(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Products</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: ProductResponse = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Product #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/products" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/products/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
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
