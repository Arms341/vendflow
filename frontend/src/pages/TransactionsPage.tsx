// JARVIS App — TransactionsPage (CONTRACT-FIRST list archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listTransactions } from '@/lib/apiClient';
import type { TransactionResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';

type Row = TransactionResponse;
type Col = { key: string; label: string; render: (row: Row) => string };

// S191 / Road 1 A3: a payments screen with no timestamp and no reference cannot be
// reconciled against a processor statement. All six of these were in the payload already.
const COLUMNS: Col[] = [
  { key: "created_at", label: "Time", render: (row) => fmtValue("created_at", row.created_at) },
  { key: "amount", label: "Amount", render: (row) => fmtValue("amount", row.amount) },
  { key: "payment_status", label: "Status", render: (row) => fmtValue("payment_status", row.payment_status) },
  { key: "slot_number", label: "Slot", render: (row) => fmtValue("slot_number", row.slot_number) },
  { key: "card_brand", label: "Card", render: (row) => row.card_last_four ? `${fmtValue("card_brand", row.card_brand)} \u2022\u2022${row.card_last_four}` : fmtValue("card_brand", row.card_brand) },
  { key: "payment_ref", label: "Reference", render: (row) => fmtValue("payment_ref", row.payment_ref) },
];

export default function TransactionsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => listTransactions(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Transactions</div>;

  const items: Row[] = data ?? [];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Link to="/transactions/new" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">New</Link>
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
                  <Link to={`/transactions/${row.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
