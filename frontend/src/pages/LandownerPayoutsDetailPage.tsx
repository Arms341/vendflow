// JARVIS App — LandownerPayoutsDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLandownerPayouts, deleteLandownerPayouts, createLandownerPayoutsPay } from '@/lib/apiClient';
import type { LandownerPayoutResponse } from '@/types/api';
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

type Field = { key: string; label: string; render: (r: LandownerPayoutResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "operator_id", label: "Operator Id", render: (r) => fmtValue("operator_id", r.operator_id) },
  { key: "landowner_id", label: "Landowner Id", render: (r) => fmtValue("landowner_id", r.landowner_id) },
  { key: "agreement_id", label: "Agreement Id", render: (r) => fmtValue("agreement_id", r.agreement_id) },
  { key: "period_start", label: "Period Start", render: (r) => fmtValue("period_start", r.period_start) },
  { key: "period_end", label: "Period End", render: (r) => fmtValue("period_end", r.period_end) },
  { key: "gross_volume", label: "Gross Volume", render: (r) => fmtValue("gross_volume", r.gross_volume) },
  { key: "net_volume", label: "Net Volume", render: (r) => fmtValue("net_volume", r.net_volume) },
  { key: "transaction_count", label: "Transaction Count", render: (r) => fmtValue("transaction_count", r.transaction_count) },
  { key: "share_amount", label: "Share Amount", render: (r) => fmtValue("share_amount", r.share_amount) },
  { key: "status", label: "Status", render: (r) => fmtValue("status", r.status) },
  { key: "payout_ref", label: "Payout Ref", render: (r) => fmtValue("payout_ref", r.payout_ref) },
  { key: "paid_at", label: "Paid At", render: (r) => fmtValue("paid_at", r.paid_at) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function LandownerPayoutsDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteLandownerPayouts(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landowner_payouts"] });
      navigate("/landowner-payouts");
    },
  });
  const payMut = useMutation({
    mutationFn: () => createLandownerPayoutsPay(recordId),
    onSuccess: (data) => { queryClient.invalidateQueries({ queryKey: ["landowner_payouts", recordId] }); queryClient.invalidateQueries({ queryKey: ["landowner_payouts"] }); toast.success('Pay complete' + (_actionResult(data) ? ' \u2014 ' + _actionResult(data) : '')); },
    onError: (err) => { toast.error(_errMsg(err)); },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["landowner_payouts", recordId],
    queryFn: () => getLandownerPayouts(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Landowner Payouts</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: LandownerPayoutResponse = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Landowner Payouts #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/landowner-payouts" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/landowner-payouts/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
          <button onClick={() => { if (window.confirm('Delete this record?')) del.mutate(); }} disabled={del.isPending} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{del.isPending ? 'Deleting\u2026' : 'Delete'}</button>
          <button onClick={() => { if (window.confirm('Pay — are you sure?')) payMut.mutate(); }} disabled={payMut.isPending} className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{payMut.isPending ? 'Pay\u2026' : 'Pay'}</button>
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
