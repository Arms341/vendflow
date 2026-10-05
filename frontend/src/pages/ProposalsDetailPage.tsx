// JARVIS App — ProposalsDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProposals, deleteProposals, createProposalsSend, createProposalsEstimate,
         type ProposalEstimateBasis } from '@/lib/apiClient';
import { useState } from 'react';
import { fmtCurrency } from '@/lib/format';
import type { ProposalResponse } from '@/types/api';
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

type Field = { key: string; label: string; render: (r: ProposalResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "lead_id", label: "Lead Id", render: (r) => fmtValue("lead_id", r.lead_id) },
  { key: "operator_id", label: "Operator Id", render: (r) => fmtValue("operator_id", r.operator_id) },
  { key: "title", label: "Title", render: (r) => fmtValue("title", r.title) },
  { key: "description", label: "Description", render: (r) => fmtValue("description", r.description) },
  { key: "machine_type", label: "Machine Type", render: (r) => fmtValue("machine_type", r.machine_type) },
  { key: "machine_count", label: "Machine Count", render: (r) => fmtValue("machine_count", r.machine_count) },
  { key: "monthly_revenue_estimate", label: "Monthly Revenue Estimate", render: (r) => fmtValue("monthly_revenue_estimate", r.monthly_revenue_estimate) },
  { key: "commission_split", label: "Commission Split", render: (r) => fmtValue("commission_split", r.commission_split) },
  { key: "placement_fee", label: "Placement Fee", render: (r) => fmtValue("placement_fee", r.placement_fee) },
  { key: "contract_term_months", label: "Contract Term Months", render: (r) => fmtValue("contract_term_months", r.contract_term_months) },
  { key: "status", label: "Status", render: (r) => fmtValue("status", r.status) },
  { key: "sent_at", label: "Sent At", render: (r) => fmtValue("sent_at", r.sent_at) },
  { key: "viewed_at", label: "Viewed At", render: (r) => fmtValue("viewed_at", r.viewed_at) },
  { key: "signed_at", label: "Signed At", render: (r) => fmtValue("signed_at", r.signed_at) },
  { key: "signature_data", label: "Signature Data", render: (r) => fmtValue("signature_data", r.signature_data) },
  { key: "pdf_url", label: "Pdf Url", render: (r) => fmtValue("pdf_url", r.pdf_url) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function ProposalsDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteProposals(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      navigate("/proposals");
    },
  });
  const [basis, setBasis] = useState<ProposalEstimateBasis | null>(null);
  const [estErr, setEstErr] = useState<string | null>(null);
  const estimateMut = useMutation({
    mutationFn: () => createProposalsEstimate(recordId),
    onSuccess: (res) => {
      setBasis(res.basis);
      setEstErr(null);
      queryClient.invalidateQueries({ queryKey: ['proposals', recordId] });
    },
    onError: (e: unknown) => {
      const x = e as { response?: { data?: { detail?: string } } };
      setBasis(null);
      setEstErr(x?.response?.data?.detail ?? 'Could not estimate');
    },
  });

  const sendMut = useMutation({
    mutationFn: () => createProposalsSend(recordId),
    onSuccess: (data) => { queryClient.invalidateQueries({ queryKey: ["proposals", recordId] }); queryClient.invalidateQueries({ queryKey: ["proposals"] }); toast.success('Send complete' + (_actionResult(data) ? ' \u2014 ' + _actionResult(data) : '')); },
    onError: (err) => { toast.error(_errMsg(err)); },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["proposals", recordId],
    queryFn: () => getProposals(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Proposals</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: ProposalResponse = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Proposal #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/proposals" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/proposals/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
          <button onClick={() => { if (window.confirm('Delete this record?')) del.mutate(); }} disabled={del.isPending} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{del.isPending ? 'Deleting\u2026' : 'Delete'}</button>
          <button onClick={() => { if (window.confirm('Send — are you sure?')) sendMut.mutate(); }} disabled={sendMut.isPending} className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{sendMut.isPending ? 'Send\u2026' : 'Send'}</button>
        </div>
      </div>
      {/* S191 — the estimate, and the evidence for it. A pitch number with no
          basis is a guess; this shows what it was derived from. */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Revenue estimate</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Derived from real net revenue for machines of the same type over the last 30 days.
            </p>
          </div>
          <button
            onClick={() => estimateMut.mutate()}
            disabled={estimateMut.isPending}
            className="shrink-0 px-3 py-2 rounded-md text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            {estimateMut.isPending ? 'Calculating\u2026' : 'Calculate from fleet data'}
          </button>
        </div>

        {estErr && (
          <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {estErr} — no estimate was written. The number stays empty rather than invented.
          </div>
        )}

        {basis && (
          <div className="mt-4">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400">Monthly revenue</div>
                <div className="text-2xl font-bold text-gray-900 tabular-nums">
                  {fmtCurrency(basis.monthly_revenue_estimate)}
                </div>
              </div>
              {basis.landowner_monthly_share && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400">
                    Landowner share ({basis.commission_split_pct}%)
                  </div>
                  <div className="text-2xl font-bold text-emerald-700 tabular-nums">
                    {fmtCurrency(basis.landowner_monthly_share)}
                  </div>
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-gray-500 leading-relaxed">
              {fmtCurrency(basis.avg_revenue_per_machine_day)} average per machine per day, from{' '}
              <strong className="text-gray-700">{basis.comparable_machines}</strong>{' '}
              {basis.machine_type ?? 'comparable'} machine{basis.comparable_machines === 1 ? '' : 's'} over{' '}
              <strong className="text-gray-700">{basis.machine_days_observed}</strong> machine-days
              ({basis.window_days}-day window) &times; 30 days &times;{' '}
              <strong className="text-gray-700">{basis.machine_count}</strong> machine
              {basis.machine_count === 1 ? '' : 's'}. Source: {basis.source}.
            </p>
          </div>
        )}
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
