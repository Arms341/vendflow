// JARVIS App — LandownerPayoutsFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createLandownerPayouts, getLandownerPayouts, listLandowners, listOperators, updateLandownerPayouts } from '@/lib/apiClient';
import type { LandownerPayoutCreate, LandownerPayoutUpdate } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const numFromInput = (schema: z.ZodTypeAny) =>
  z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)), schema);

// S191 / Road 1 A2 (port of staged frontend_codegen v1.34.0).
// numFromInput existed for numbers; strings and enums had no equivalent, so
// reset(existing.data) fed a NULL column straight into z.string().optional()
// and every edit form on a row with a null text field refused to save —
// eight "Expected string, received null" messages and no request sent.
// [MEASURED S191]  Trade, stated: a blank optional field now means "leave
// alone" (omitted from the PUT; the locked routes use exclude_unset), so an
// optional string cannot be CLEARED from the form.
const optFromInput = (schema: z.ZodTypeAny) =>
  z.preprocess((v) => (v === '' || v === null || v === undefined ? undefined : v), schema);

/** Nulls arriving from the API become undefined at the form's front door. */
const nullsToUndefined = <T,>(data: T): T => {
  if (!data || typeof data !== 'object') return data;
  const out: Record<string, unknown> = { ...(data as Record<string, unknown>) };
  for (const k of Object.keys(out)) if (out[k] === null) out[k] = undefined;
  return out as T;
};

const schema = z.object({
  "operator_id": numFromInput(z.number().int().optional()),
  "landowner_id": numFromInput(z.number().int().optional()),
  "agreement_id": numFromInput(z.number().int().optional()),
  "gross_volume": numFromInput(z.number().optional()),
  "net_volume": numFromInput(z.number().optional()),
  "transaction_count": numFromInput(z.number().int().optional()),
  "share_amount": numFromInput(z.number().optional()),
  "status": z.enum(["pending", "approved", "paid", "failed"]),
  "payout_ref": optFromInput(z.string().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function LandownerPayoutsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const operatorIdOptions = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });
  const landownerIdOptions = useQuery({ queryKey: ["landowners"], queryFn: () => listLandowners() });

  const existing = useQuery({
    queryKey: ["landowner_payouts", recordId],
    queryFn: () => getLandownerPayouts(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "payout_ref": "",
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateLandownerPayouts(recordId, values as LandownerPayoutUpdate) : createLandownerPayouts(values as LandownerPayoutCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landowner_payouts"] });
      navigate('/landowner-payouts');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Landowner Payouts' : 'New Landowner Payouts'}</h1>
        <Link to="/landowner-payouts" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label htmlFor="operator_id" className="block text-sm font-medium text-gray-700">Operator</label>
          <select {...register("operator_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(operatorIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.name ?? o.id)}</option>
            ))}
          </select>
        {errors.operator_id && <p className="text-xs text-red-600 mt-1">{String(errors.operator_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="landowner_id" className="block text-sm font-medium text-gray-700">Landowner</label>
          <select {...register("landowner_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(landownerIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.name ?? o.id)}</option>
            ))}
          </select>
        {errors.landowner_id && <p className="text-xs text-red-600 mt-1">{String(errors.landowner_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="agreement_id" className="block text-sm font-medium text-gray-700">Agreement</label>
          <input type="number" {...register("agreement_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.agreement_id && <p className="text-xs text-red-600 mt-1">{String(errors.agreement_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="gross_volume" className="block text-sm font-medium text-gray-700">Gross Volume</label>
          <input type="number" step="any" {...register("gross_volume")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.gross_volume && <p className="text-xs text-red-600 mt-1">{String(errors.gross_volume.message)}</p>}
        </div>
        <div>
          <label htmlFor="net_volume" className="block text-sm font-medium text-gray-700">Net Volume</label>
          <input type="number" step="any" {...register("net_volume")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.net_volume && <p className="text-xs text-red-600 mt-1">{String(errors.net_volume.message)}</p>}
        </div>
        <div>
          <label htmlFor="transaction_count" className="block text-sm font-medium text-gray-700">Transaction Count</label>
          <input type="number" {...register("transaction_count")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.transaction_count && <p className="text-xs text-red-600 mt-1">{String(errors.transaction_count.message)}</p>}
        </div>
        <div>
          <label htmlFor="share_amount" className="block text-sm font-medium text-gray-700">Share Amount</label>
          <input type="number" step="any" {...register("share_amount")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.share_amount && <p className="text-xs text-red-600 mt-1">{String(errors.share_amount.message)}</p>}
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register("status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        {errors.status && <p className="text-xs text-red-600 mt-1">{String(errors.status.message)}</p>}
        </div>
        <div>
          <label htmlFor="payout_ref" className="block text-sm font-medium text-gray-700">Payout Ref</label>
          <input type="text" {...register("payout_ref")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.payout_ref && <p className="text-xs text-red-600 mt-1">{String(errors.payout_ref.message)}</p>}
        </div>
        <div className="pt-2">
          <button type="submit" disabled={isSubmitting || mutation.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50">
            {mutation.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
        {mutation.isError && <p className="text-sm text-red-600">Failed to save. Please try again.</p>}
      </form>
    </div>
  );
}
