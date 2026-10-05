// JARVIS App — WholesaleOrdersDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getWholesaleOrders, deleteWholesaleOrders } from '@/lib/apiClient';
import type { WholesaleOrderResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Field = { key: string; label: string; render: (r: WholesaleOrderResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "operator_id", label: "Operator Id", render: (r) => fmtValue("operator_id", r.operator_id) },
  { key: "account_id", label: "Account Id", render: (r) => fmtValue("account_id", r.account_id) },
  { key: "standing_order_id", label: "Standing Order Id", render: (r) => fmtValue("standing_order_id", r.standing_order_id) },
  { key: "machine_id", label: "Machine Id", render: (r) => fmtValue("machine_id", r.machine_id) },
  { key: "transaction_id", label: "Transaction Id", render: (r) => fmtValue("transaction_id", r.transaction_id) },
  { key: "quantity_bags", label: "Quantity Bags", render: (r) => fmtValue("quantity_bags", r.quantity_bags) },
  { key: "quantity_lbs", label: "Quantity Lbs", render: (r) => fmtValue("quantity_lbs", r.quantity_lbs) },
  { key: "unit_price", label: "Unit Price", render: (r) => fmtValue("unit_price", r.unit_price) },
  { key: "subtotal", label: "Subtotal", render: (r) => fmtValue("subtotal", r.subtotal) },
  { key: "fee_amount", label: "Fee Amount", render: (r) => fmtValue("fee_amount", r.fee_amount) },
  { key: "total", label: "Total", render: (r) => fmtValue("total", r.total) },
  { key: "payment_method", label: "Payment Method", render: (r) => fmtValue("payment_method", r.payment_method) },
  { key: "payment_status", label: "Payment Status", render: (r) => fmtValue("payment_status", r.payment_status) },
  { key: "payment_ref", label: "Payment Ref", render: (r) => fmtValue("payment_ref", r.payment_ref) },
  { key: "fulfillment_status", label: "Fulfillment Status", render: (r) => fmtValue("fulfillment_status", r.fulfillment_status) },
  { key: "ordered_at", label: "Ordered At", render: (r) => fmtValue("ordered_at", r.ordered_at) },
  { key: "fulfilled_at", label: "Fulfilled At", render: (r) => fmtValue("fulfilled_at", r.fulfilled_at) },
  { key: "idempotency_key", label: "Idempotency Key", render: (r) => fmtValue("idempotency_key", r.idempotency_key) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function WholesaleOrdersDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteWholesaleOrders(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wholesale_orders"] });
      navigate("/wholesale-orders");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["wholesale_orders", recordId],
    queryFn: () => getWholesaleOrders(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Wholesale Orders</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: WholesaleOrderResponse = data;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Wholesale Orders #{String(record.id ?? '')}</h1>
        <div className="flex space-x-2">
          <Link to="/wholesale-orders" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/wholesale-orders/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
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
