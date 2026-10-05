// JARVIS App — StandingOrdersPage (CONTRACT-FIRST list archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listStandingOrders, createStandingOrdersRun } from '@/lib/apiClient';
import type { StandingOrderResponse } from '@/types/api';
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

type Row = StandingOrderResponse;
type Col = { key: string; label: string; render: (row: Row) => string };

const COLUMNS: Col[] = [
  { key: "id", label: "ID", render: (row) => fmtValue("id", row.id) },
  { key: "operator_id", label: "Operator Id", render: (row) => fmtValue("operator_id", row.operator_id) },
  { key: "account_id", label: "Account Id", render: (row) => fmtValue("account_id", row.account_id) },
  { key: "machine_id", label: "Machine Id", render: (row) => fmtValue("machine_id", row.machine_id) },
  { key: "frequency", label: "Frequency", render: (row) => fmtValue("frequency", row.frequency) },
  { key: "quantity_bags", label: "Quantity Bags", render: (row) => fmtValue("quantity_bags", row.quantity_bags) },
];

export default function StandingOrdersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["standing_orders"],
    queryFn: () => listStandingOrders(),
  });
  const queryClient = useQueryClient();
  const runMut = useMutation({
    mutationFn: () => createStandingOrdersRun(),
    onSuccess: (data) => { queryClient.invalidateQueries({ queryKey: ["standing_orders"] }); toast.success('Run complete' + (_actionResult(data) ? ' \u2014 ' + _actionResult(data) : '')); },
    onError: (err) => { toast.error(_errMsg(err)); },
  });
  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Standing Orders</div>;

  const items: Row[] = data ?? [];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Standing Orders</h1>
        <Link to="/standing-orders/new" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">New</Link>
          <button onClick={() => { if (window.confirm('Run — are you sure?')) runMut.mutate(); }} disabled={runMut.isPending} className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{runMut.isPending ? 'Run\u2026' : 'Run'}</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {COLUMNS.map((col: Col) => (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="px-6 py-14 text-center">
                  <div className="text-sm text-gray-600">Nothing here yet.</div>
                  <div className="text-xs text-gray-400 mt-1">Records will appear as soon as there are some.</div>
                </td>
              </tr>
            )}
            {items.map((row: Row) => (
              <tr key={row.id}>
                {COLUMNS.map((col: Col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {col.render(row)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link to={`/standing-orders/${row.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
