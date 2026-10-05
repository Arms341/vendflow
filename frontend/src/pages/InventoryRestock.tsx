// JARVIS App — InventoryRestock (CONTRACT-FIRST restock archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_restock_page).
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listInventories, updateInventories } from '@/lib/apiClient';
import type { InventoryItemResponse, InventoryItemUpdate } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';

type Row = InventoryItemResponse;

export default function InventoryRestock() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["inventories"],
    queryFn: () => listInventories(),
  });

  const [drafts, setDrafts] = useState<Record<number, string>>({});

  const restock = useMutation({
    mutationFn: (vars: { id: number; qty: number }) =>
      updateInventories(vars.id, { current_qty: vars.qty } as InventoryItemUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });

  // S194: a self-replenishing slot (stock_tracked === false) has nothing to restock.
  const rows: Row[] = (data ?? []).filter((r: Row) => (r as { stock_tracked?: boolean | null }).stock_tracked !== false);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Inventories</div>;

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Inventories</h1>
        <p className="text-sm text-gray-500">Update on-hand quantities. Each row saves independently.</p>
      </div>
      {rows.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          Nothing to restock yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Machine Id</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Id</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Slot Number</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current Qty</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Max Qty</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">New Qty</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row: Row) => {
                const draft = drafts[row.id] ?? fmtValue("current_qty", row.current_qty);
                return (
                  <tr key={row.id}>
                    <td className="px-4 py-2 text-sm text-gray-700">{fmtValue("machine_id", row.machine_id)}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{fmtValue("product_id", row.product_id)}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{fmtValue("slot_number", row.slot_number)}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{fmtValue("current_qty", row.current_qty)}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{fmtValue("max_qty", row.max_qty)}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={draft}
                        onChange={(e) => setDrafts((d) => ({ ...d, [row.id]: e.target.value }))}
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => restock.mutate({ id: row.id, qty: Number(draft) || 0 })}
                        disabled={restock.isPending}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
