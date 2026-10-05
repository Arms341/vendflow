// JARVIS App — ProposalsFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createProposals, getProposals, listLeads, listOperators, updateProposals } from '@/lib/apiClient';
import type { ProposalCreate, ProposalUpdate } from '@/types/api';
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
  "lead_id": numFromInput(z.number().int().optional()),
  "operator_id": numFromInput(z.number().int().optional()),
  "title": z.string().min(1, 'Required'),
  "description": optFromInput(z.string().optional()),
  "machine_type": optFromInput(z.string().optional()),
  "machine_count": numFromInput(z.number().int().optional()),
  "monthly_revenue_estimate": numFromInput(z.number().optional()),
  "commission_split": numFromInput(z.number().optional()),
  "placement_fee": numFromInput(z.number().optional()),
  "contract_term_months": numFromInput(z.number().int().optional()),
  "status": z.string().min(1, 'Required'),
  "signature_data": optFromInput(z.string().optional()),
  "pdf_url": optFromInput(z.string().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function ProposalsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const leadIdOptions = useQuery({ queryKey: ["leads"], queryFn: () => listLeads() });
  const operatorIdOptions = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });

  const existing = useQuery({
    queryKey: ["proposals", recordId],
    queryFn: () => getProposals(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "title": "",
    "description": "",
    "machine_type": "",
    "status": "",
    "signature_data": "",
    "pdf_url": "",
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateProposals(recordId, values as ProposalUpdate) : createProposals(values as ProposalCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      navigate('/proposals');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Proposal' : 'New Proposal'}</h1>
        <Link to="/proposals" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label htmlFor="lead_id" className="block text-sm font-medium text-gray-700">Lead</label>
          <select {...register("lead_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(leadIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.business_name ?? o.id)}</option>
            ))}
          </select>
        {errors.lead_id && <p className="text-xs text-red-600 mt-1">{String(errors.lead_id.message)}</p>}
        </div>
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
          <input type="text" {...register("title")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.title && <p className="text-xs text-red-600 mt-1">{String(errors.title.message)}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input type="text" {...register("description")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.description && <p className="text-xs text-red-600 mt-1">{String(errors.description.message)}</p>}
        </div>
        <div>
          <label htmlFor="machine_type" className="block text-sm font-medium text-gray-700">Machine Type</label>
          <input type="text" {...register("machine_type")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.machine_type && <p className="text-xs text-red-600 mt-1">{String(errors.machine_type.message)}</p>}
        </div>
        <div>
          <label htmlFor="machine_count" className="block text-sm font-medium text-gray-700">Machine Count</label>
          <input type="number" {...register("machine_count")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.machine_count && <p className="text-xs text-red-600 mt-1">{String(errors.machine_count.message)}</p>}
        </div>
        <div>
          <label htmlFor="monthly_revenue_estimate" className="block text-sm font-medium text-gray-700">Monthly Revenue Estimate</label>
          <input type="number" step="any" {...register("monthly_revenue_estimate")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.monthly_revenue_estimate && <p className="text-xs text-red-600 mt-1">{String(errors.monthly_revenue_estimate.message)}</p>}
        </div>
        <div>
          <label htmlFor="commission_split" className="block text-sm font-medium text-gray-700">Commission Split</label>
          <input type="number" step="any" {...register("commission_split")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.commission_split && <p className="text-xs text-red-600 mt-1">{String(errors.commission_split.message)}</p>}
        </div>
        <div>
          <label htmlFor="placement_fee" className="block text-sm font-medium text-gray-700">Placement Fee</label>
          <input type="number" step="any" {...register("placement_fee")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.placement_fee && <p className="text-xs text-red-600 mt-1">{String(errors.placement_fee.message)}</p>}
        </div>
        <div>
          <label htmlFor="contract_term_months" className="block text-sm font-medium text-gray-700">Contract Term Months</label>
          <input type="number" {...register("contract_term_months")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.contract_term_months && <p className="text-xs text-red-600 mt-1">{String(errors.contract_term_months.message)}</p>}
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status *</label>
          <input type="text" {...register("status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.status && <p className="text-xs text-red-600 mt-1">{String(errors.status.message)}</p>}
        </div>
        <div>
          <label htmlFor="signature_data" className="block text-sm font-medium text-gray-700">Signature Data</label>
          <input type="text" {...register("signature_data")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.signature_data && <p className="text-xs text-red-600 mt-1">{String(errors.signature_data.message)}</p>}
        </div>
        <div>
          <label htmlFor="pdf_url" className="block text-sm font-medium text-gray-700">Pdf Url</label>
          <input type="text" {...register("pdf_url")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.pdf_url && <p className="text-xs text-red-600 mt-1">{String(errors.pdf_url.message)}</p>}
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
