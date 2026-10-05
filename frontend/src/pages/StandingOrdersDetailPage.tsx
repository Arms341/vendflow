// JARVIS App — StandingOrdersDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStandingOrders, deleteStandingOrders } from '@/lib/apiClient';
import type { StandingOrderResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Field = { key: string; label: string; render: (r: StandingOrderResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "operator_id", label: "Operator Id", render: (r) => fmtValue("operator_id", r.operator_id) },
  { key: "account_id", label: "Account Id", render: (r) => fmtValue("account_id", r.account_id) },
  { key: "machine_id", label: "Machine Id", render: (r) => fmtValue("machine_id", r.machine_id) },
  { key: "frequency", label: "Frequency", render: (r) => fmtValue("frequency", r.frequency) },
  { key: "quantity_bags", label: "Quantity Bags", render: (r) => fmtValue("quantity_bags", r.quantity_bags) },
  { key: "quantity_lbs", label: "Quantity Lbs", render: (r) => fmtValue("quantity_lbs", r.quantity_lbs) },
  { key: "unit_price", label: "Unit Price", render: (r) => fmtValue("unit_price", r.unit_price) },
  { key: "fulfillment_method", label: "Fulfillment Method", render: (r) => fmtValue("fulfillment_method", r.fulfillment_method) },
  { key: "next_charge_date", label: "Next Charge Date", render: (r) => fmtValue("next_charge_date", r.next_charge_date) },
  { key: "last_charged_at", label: "Last Charged At", render: (r) => fmtValue("last_charged_at", r.last_charged_at) },
  { key: "status", label: "Status", render: (r) => fmtValue("status", r.status) },
  { key: "is_active", label: "Is Active", render: (r) => fmtValue("is_active", r.is_active) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function StandingOrdersDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteStandingOrders(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["standing_orders"] });
      navigate("/standing-orders");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["standing_orders", recordId],
    queryFn: () => getStandingOrders(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Standing Orders</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: StandingOrderResponse = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Standing Orders #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/standing-orders" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/standing-orders/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
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
