// JARVIS App — ServiceVisitsFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createServiceVisits, getServiceVisits, listMachines, listRoutes, updateServiceVisits } from '@/lib/apiClient';
import type { ServiceVisitCreate, ServiceVisitUpdate } from '@/types/api';
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
  "machine_id": numFromInput(z.number().int()),
  "driver_id": numFromInput(z.number().int()),
  "route_id": numFromInput(z.number().int().optional()),
  "visit_type": optFromInput(z.string().optional()),
  "notes": optFromInput(z.string().optional()),
  "cash_collected": numFromInput(z.number().optional()),
  "products_restocked_json": optFromInput(z.string().optional()),
  "issues_found_json": optFromInput(z.string().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function ServiceVisitsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const machineIdOptions = useQuery({ queryKey: ["machines"], queryFn: () => listMachines() });
  const routeIdOptions = useQuery({ queryKey: ["routes"], queryFn: () => listRoutes() });

  const existing = useQuery({
    queryKey: ["service_visits", recordId],
    queryFn: () => getServiceVisits(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "visit_type": "",
    "notes": "",
    "products_restocked_json": "",
    "issues_found_json": "",
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateServiceVisits(recordId, values as ServiceVisitUpdate) : createServiceVisits(values as ServiceVisitCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_visits"] });
      navigate('/service-visits');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Service Visits' : 'New Service Visits'}</h1>
        <Link to="/service-visits" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label htmlFor="machine_id" className="block text-sm font-medium text-gray-700">Machine Id *</label>
          <select {...register("machine_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(machineIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.name ?? o.id)}</option>
            ))}
          </select>
        {errors.machine_id && <p className="text-xs text-red-600 mt-1">{String(errors.machine_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="driver_id" className="block text-sm font-medium text-gray-700">Driver Id *</label>
          <input type="number" {...register("driver_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.driver_id && <p className="text-xs text-red-600 mt-1">{String(errors.driver_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="route_id" className="block text-sm font-medium text-gray-700">Route</label>
          <select {...register("route_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(routeIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.name ?? o.id)}</option>
            ))}
          </select>
        {errors.route_id && <p className="text-xs text-red-600 mt-1">{String(errors.route_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="visit_type" className="block text-sm font-medium text-gray-700">Visit Type</label>
          <input type="text" {...register("visit_type")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.visit_type && <p className="text-xs text-red-600 mt-1">{String(errors.visit_type.message)}</p>}
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <input type="text" {...register("notes")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.notes && <p className="text-xs text-red-600 mt-1">{String(errors.notes.message)}</p>}
        </div>
        <div>
          <label htmlFor="cash_collected" className="block text-sm font-medium text-gray-700">Cash Collected</label>
          <input type="number" step="any" {...register("cash_collected")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.cash_collected && <p className="text-xs text-red-600 mt-1">{String(errors.cash_collected.message)}</p>}
        </div>
        <div>
          <label htmlFor="products_restocked_json" className="block text-sm font-medium text-gray-700">Products Restocked Json</label>
          <input type="text" {...register("products_restocked_json")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.products_restocked_json && <p className="text-xs text-red-600 mt-1">{String(errors.products_restocked_json.message)}</p>}
        </div>
        <div>
          <label htmlFor="issues_found_json" className="block text-sm font-medium text-gray-700">Issues Found Json</label>
          <input type="text" {...register("issues_found_json")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.issues_found_json && <p className="text-xs text-red-600 mt-1">{String(errors.issues_found_json.message)}</p>}
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
