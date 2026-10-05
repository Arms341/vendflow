// JARVIS App — WholesaleAccountsDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getWholesaleAccounts, deleteWholesaleAccounts, createWholesaleAccountsCharge } from '@/lib/apiClient';
import type { WholesaleAccountResponse } from '@/types/api';
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
const _newIdemKey = (): string => {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return 'idem-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
};

type Field = { key: string; label: string; render: (r: WholesaleAccountResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "business_name", label: "Business Name", render: (r) => fmtValue("business_name", r.business_name) },
  { key: "contact_name", label: "Contact Name", render: (r) => fmtValue("contact_name", r.contact_name) },
  { key: "contact_email", label: "Contact Email", render: (r) => fmtValue("contact_email", r.contact_email) },
  { key: "contact_phone", label: "Contact Phone", render: (r) => fmtValue("contact_phone", r.contact_phone) },
  { key: "address", label: "Address", render: (r) => fmtValue("address", r.address) },
  { key: "city", label: "City", render: (r) => fmtValue("city", r.city) },
  { key: "state", label: "State", render: (r) => fmtValue("state", r.state) },
  { key: "zip_code", label: "Zip Code", render: (r) => fmtValue("zip_code", r.zip_code) },
  { key: "account_type", label: "Account Type", render: (r) => fmtValue("account_type", r.account_type) },
  { key: "billing_terms", label: "Billing Terms", render: (r) => fmtValue("billing_terms", r.billing_terms) },
  { key: "price_per_bag", label: "Price Per Bag", render: (r) => fmtValue("price_per_bag", r.price_per_bag) },
  { key: "price_per_lb", label: "Price Per Lb", render: (r) => fmtValue("price_per_lb", r.price_per_lb) },
  { key: "credit_limit", label: "Credit Limit", render: (r) => fmtValue("credit_limit", r.credit_limit) },
  { key: "balance", label: "Balance", render: (r) => fmtValue("balance", r.balance) },
  { key: "card_on_file_token_ref", label: "Card On File Token Ref", render: (r) => fmtValue("card_on_file_token_ref", r.card_on_file_token_ref) },
  { key: "card_brand", label: "Card Brand", render: (r) => fmtValue("card_brand", r.card_brand) },
  { key: "card_last_four", label: "Card Last Four", render: (r) => fmtValue("card_last_four", r.card_last_four) },
  { key: "status", label: "Status", render: (r) => fmtValue("status", r.status) },
  { key: "is_active", label: "Is Active", render: (r) => fmtValue("is_active", r.is_active) },
  { key: "operator_id", label: "Operator Id", render: (r) => fmtValue("operator_id", r.operator_id) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function WholesaleAccountsDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteWholesaleAccounts(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wholesale_accounts"] });
      navigate("/wholesale-accounts");
    },
  });
  const [chargeQuantityBags, setChargeQuantityBags] = useState<number>(1);
  const [chargeIdemKey, setChargeIdemKey] = useState<string>(() => _newIdemKey());
  const chargeMut = useMutation({
    mutationFn: () => createWholesaleAccountsCharge(recordId, { quantity_bags: Number(chargeQuantityBags) }, { "Idempotency-Key": chargeIdemKey }),
    onSuccess: (data) => { setChargeIdemKey(_newIdemKey()); queryClient.invalidateQueries({ queryKey: ["wholesale_accounts", recordId] }); queryClient.invalidateQueries({ queryKey: ["wholesale_accounts"] }); toast.success('Charge complete' + (_actionResult(data) ? ' \u2014 ' + _actionResult(data) : '')); },
    onError: (err) => { toast.error(_errMsg(err)); },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["wholesale_accounts", recordId],
    queryFn: () => getWholesaleAccounts(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Wholesale Accounts</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: WholesaleAccountResponse = data;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Wholesale Accounts #{String(record.id ?? '')}</h1>
        <div className="flex space-x-2">
          <Link to="/wholesale-accounts" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/wholesale-accounts/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
          <button onClick={() => { if (window.confirm('Delete this record?')) del.mutate(); }} disabled={del.isPending} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{del.isPending ? 'Deleting\u2026' : 'Delete'}</button>
          <input type="number" value={chargeQuantityBags ?? ''} onChange={(e) => setChargeQuantityBags(Number(e.target.value))} className="w-24 px-2 py-2 border border-gray-300 rounded-md text-sm" />
          <button onClick={() => { if (window.confirm('Charge — are you sure?')) chargeMut.mutate(); }} disabled={chargeMut.isPending} className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{chargeMut.isPending ? 'Charge\u2026' : 'Charge'}</button>
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
