// JARVIS App — Pricing (CONTRACT-FIRST action-table archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_action_table_page).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listInventories, deleteInventories, createInventoriesClearPrice } from '@/lib/apiClient';
import type { InventoryItemResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { fmtValue } from '@/lib/format';

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

type Row = InventoryItemResponse;
type Col = { key: string; label: string; render: (row: Row) => string };

const COLUMNS: Col[] = [
  { key: "id", label: "ID", render: (row) => fmtValue("id", row.id) },
  { key: "machine_id", label: "Machine Id", render: (row) => fmtValue("machine_id", row.machine_id) },
  { key: "product_id", label: "Product Id", render: (row) => fmtValue("product_id", row.product_id) },
  { key: "slot_number", label: "Slot Number", render: (row) => fmtValue("slot_number", row.slot_number) },
  { key: "current_qty", label: "Current Qty", render: (row) => fmtValue("current_qty", row.current_qty) },
  { key: "max_qty", label: "Max Qty", render: (row) => fmtValue("max_qty", row.max_qty) },
];

export default function Pricing() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["inventories"],
    queryFn: () => listInventories(),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => deleteInventories(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });

  const clearPriceMut = useMutation({
    mutationFn: (id: number) => createInventoriesClearPrice(id),
    onSuccess: (data) => { queryClient.invalidateQueries({ queryKey: ["inventories"] }); toast.success('Clear Price complete' + (_actionResult(data) ? ' \u2014 ' + _actionResult(data) : '')); },
    onError: (err) => { toast.error(_errMsg(err)); },
  });
  const handleClearPrice = (id: number) => {
    if (window.confirm('Clear Price \u2014 are you sure?')) {
      clearPriceMut.mutate(id);
    }
  };
  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Pricing</div>;

  const items: Row[] = data ?? [];

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this record? This cannot be undone.')) {
      removeMutation.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
          <p className="mt-1 text-sm text-gray-500">{"Per-machine slot pricing table: effective price per slot with override indicator and bulk price action"}</p>
        </div>
        <Link to="/inventories/new" className="shrink-0 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">New</Link>
      </div>
      {items.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          Nothing here yet. Click “New” to create the first record.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS.map((col: Col) => (
                  <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((row: Row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {COLUMNS.map((col: Col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {col.render(row)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                    <Link to={`/inventories/${row.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                    <button
                      type="button"
                      onClick={() => handleClearPrice(row.id)}
                      disabled={clearPriceMut.isPending}
                      className="text-green-600 hover:underline disabled:opacity-50"
                    >
                      Clear Price
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row.id)}
                      disabled={removeMutation.isPending}
                      className="text-red-600 hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
