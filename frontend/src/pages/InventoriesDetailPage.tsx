// JARVIS App — InventoriesDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getInventories, deleteInventories, createInventoriesClearPrice } from '@/lib/apiClient';
import type { InventoryItemResponse } from '@/types/api';
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

type Field = { key: string; label: string; render: (r: InventoryItemResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "machine_id", label: "Machine Id", render: (r) => fmtValue("machine_id", r.machine_id) },
  { key: "product_id", label: "Product Id", render: (r) => fmtValue("product_id", r.product_id) },
  { key: "slot_number", label: "Slot Number", render: (r) => fmtValue("slot_number", r.slot_number) },
  { key: "current_qty", label: "Current Qty", render: (r) => fmtValue("current_qty", r.current_qty) },
  { key: "max_qty", label: "Max Qty", render: (r) => fmtValue("max_qty", r.max_qty) },
  { key: "last_restocked_at", label: "Last Restocked At", render: (r) => fmtValue("last_restocked_at", r.last_restocked_at) },
  { key: "price", label: "Price", render: (r) => fmtValue("price", r.price) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function InventoriesDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteInventories(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      navigate("/inventories");
    },
  });
  const clearPriceMut = useMutation({
    mutationFn: () => createInventoriesClearPrice(recordId),
    onSuccess: (data) => { queryClient.invalidateQueries({ queryKey: ["inventories", recordId] }); queryClient.invalidateQueries({ queryKey: ["inventories"] }); toast.success('Clear Price complete' + (_actionResult(data) ? ' \u2014 ' + _actionResult(data) : '')); },
    onError: (err) => { toast.error(_errMsg(err)); },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["inventories", recordId],
    queryFn: () => getInventories(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Inventories</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: InventoryItemResponse = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Inventory #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/inventories" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/inventories/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
          <button onClick={() => { if (window.confirm('Delete this record?')) del.mutate(); }} disabled={del.isPending} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{del.isPending ? 'Deleting\u2026' : 'Delete'}</button>
          <button onClick={() => { if (window.confirm('Clear Price — are you sure?')) clearPriceMut.mutate(); }} disabled={clearPriceMut.isPending} className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{clearPriceMut.isPending ? 'Clear Price\u2026' : 'Clear Price'}</button>
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
