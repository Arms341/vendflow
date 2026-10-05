// JARVIS App — TransactionsDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTransactions, deleteTransactions } from '@/lib/apiClient';
import type { TransactionResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Field = { key: string; label: string; render: (r: TransactionResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "machine_id", label: "Machine Id", render: (r) => fmtValue("machine_id", r.machine_id) },
  { key: "product_id", label: "Product Id", render: (r) => fmtValue("product_id", r.product_id) },
  { key: "amount", label: "Amount", render: (r) => fmtValue("amount", r.amount) },
  { key: "payment_method", label: "Payment Method", render: (r) => fmtValue("payment_method", r.payment_method) },
  { key: "payment_status", label: "Payment Status", render: (r) => fmtValue("payment_status", r.payment_status) },
  { key: "payment_ref", label: "Payment Ref", render: (r) => fmtValue("payment_ref", r.payment_ref) },
  { key: "card_brand", label: "Card Brand", render: (r) => fmtValue("card_brand", r.card_brand) },
  { key: "card_last_four", label: "Card Last Four", render: (r) => fmtValue("card_last_four", r.card_last_four) },
  { key: "terminal_id", label: "Terminal Id", render: (r) => fmtValue("terminal_id", r.terminal_id) },
  { key: "slot_number", label: "Slot Number", render: (r) => fmtValue("slot_number", r.slot_number) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
];

export default function TransactionsDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteTransactions(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      navigate("/transactions");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions", recordId],
    queryFn: () => getTransactions(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Transactions</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: TransactionResponse = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Transaction #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/transactions" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/transactions/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
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
