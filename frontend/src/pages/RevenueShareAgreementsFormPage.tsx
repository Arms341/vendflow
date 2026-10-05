// JARVIS App — RevenueShareAgreementsFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createRevenueShareAgreements, getRevenueShareAgreements, listLandowners, listLocations, listMachines, listOperators, updateRevenueShareAgreements } from '@/lib/apiClient';
import type { RevenueShareAgreementCreate, RevenueShareAgreementUpdate } from '@/types/api';
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
  "location_id": numFromInput(z.number().int().optional()),
  "machine_id": numFromInput(z.number().int().optional()),
  "share_type": z.enum(["percent", "flat"]),
  "share_rate": numFromInput(z.number().optional()),
  "minimum_guarantee": numFromInput(z.number().optional()),
  "status": z.enum(["active", "inactive", "expired"]),
});

type FormValues = z.infer<typeof schema>;

export default function RevenueShareAgreementsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const operatorIdOptions = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });
  const landownerIdOptions = useQuery({ queryKey: ["landowners"], queryFn: () => listLandowners() });
  const locationIdOptions = useQuery({ queryKey: ["locations"], queryFn: () => listLocations() });
  const machineIdOptions = useQuery({ queryKey: ["machines"], queryFn: () => listMachines() });

  const existing = useQuery({
    queryKey: ["revenue_share_agreements", recordId],
    queryFn: () => getRevenueShareAgreements(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {} as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateRevenueShareAgreements(recordId, values as RevenueShareAgreementUpdate) : createRevenueShareAgreements(values as RevenueShareAgreementCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue_share_agreements"] });
      navigate('/revenue-share-agreements');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Revenue Share Agreements' : 'New Revenue Share Agreements'}</h1>
        <Link to="/revenue-share-agreements" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
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
          <label htmlFor="location_id" className="block text-sm font-medium text-gray-700">Location</label>
          <select {...register("location_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(locationIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.name ?? o.id)}</option>
            ))}
          </select>
        {errors.location_id && <p className="text-xs text-red-600 mt-1">{String(errors.location_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="machine_id" className="block text-sm font-medium text-gray-700">Machine</label>
          <select {...register("machine_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(machineIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.name ?? o.id)}</option>
            ))}
          </select>
        {errors.machine_id && <p className="text-xs text-red-600 mt-1">{String(errors.machine_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="share_type" className="block text-sm font-medium text-gray-700">Share Type</label>
          <select {...register("share_type")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="percent">Percent</option>
            <option value="flat">Flat</option>
          </select>
        {errors.share_type && <p className="text-xs text-red-600 mt-1">{String(errors.share_type.message)}</p>}
        </div>
        <div>
          <label htmlFor="share_rate" className="block text-sm font-medium text-gray-700">Share Rate</label>
          <input type="number" step="any" {...register("share_rate")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.share_rate && <p className="text-xs text-red-600 mt-1">{String(errors.share_rate.message)}</p>}
        </div>
        <div>
          <label htmlFor="minimum_guarantee" className="block text-sm font-medium text-gray-700">Minimum Guarantee</label>
          <input type="number" step="any" {...register("minimum_guarantee")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.minimum_guarantee && <p className="text-xs text-red-600 mt-1">{String(errors.minimum_guarantee.message)}</p>}
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register("status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        {errors.status && <p className="text-xs text-red-600 mt-1">{String(errors.status.message)}</p>}
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
