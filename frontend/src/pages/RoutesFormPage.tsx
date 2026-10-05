// JARVIS App — RoutesFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoutes, getRoutes, listOperators, updateRoutes } from '@/lib/apiClient';
import type { RouteCreate, RouteUpdate } from '@/types/api';
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
  "operator_id": numFromInput(z.number().int()),
  "driver_id": numFromInput(z.number().int().optional()),
  "name": z.string().min(1, 'Required'),
  "status": z.enum(["planned", "in_progress", "completed", "cancelled"]),
  "machine_ids_json": optFromInput(z.string().optional()),
  "optimized_order_json": optFromInput(z.string().optional()),
  "total_distance_miles": numFromInput(z.number().optional()),
  "notes": optFromInput(z.string().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function RoutesFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const operatorIdOptions = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });

  const existing = useQuery({
    queryKey: ["routes", recordId],
    queryFn: () => getRoutes(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "name": "",
    "machine_ids_json": "",
    "optimized_order_json": "",
    "notes": "",
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateRoutes(recordId, values as RouteUpdate) : createRoutes(values as RouteCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      navigate('/routes');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Route' : 'New Route'}</h1>
        <Link to="/routes" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label htmlFor="operator_id" className="block text-sm font-medium text-gray-700">Operator Id *</label>
          <select {...register("operator_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(operatorIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.name ?? o.id)}</option>
            ))}
          </select>
        {errors.operator_id && <p className="text-xs text-red-600 mt-1">{String(errors.operator_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="driver_id" className="block text-sm font-medium text-gray-700">Driver</label>
          <input type="number" {...register("driver_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.driver_id && <p className="text-xs text-red-600 mt-1">{String(errors.driver_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
          <input type="text" {...register("name")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.name && <p className="text-xs text-red-600 mt-1">{String(errors.name.message)}</p>}
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register("status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        {errors.status && <p className="text-xs text-red-600 mt-1">{String(errors.status.message)}</p>}
        </div>
        <div>
          <label htmlFor="machine_ids_json" className="block text-sm font-medium text-gray-700">Machine Ids Json</label>
          <input type="text" {...register("machine_ids_json")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.machine_ids_json && <p className="text-xs text-red-600 mt-1">{String(errors.machine_ids_json.message)}</p>}
        </div>
        <div>
          <label htmlFor="optimized_order_json" className="block text-sm font-medium text-gray-700">Optimized Order Json</label>
          <input type="text" {...register("optimized_order_json")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.optimized_order_json && <p className="text-xs text-red-600 mt-1">{String(errors.optimized_order_json.message)}</p>}
        </div>
        <div>
          <label htmlFor="total_distance_miles" className="block text-sm font-medium text-gray-700">Total Distance Miles</label>
          <input type="number" step="any" {...register("total_distance_miles")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.total_distance_miles && <p className="text-xs text-red-600 mt-1">{String(errors.total_distance_miles.message)}</p>}
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <input type="text" {...register("notes")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.notes && <p className="text-xs text-red-600 mt-1">{String(errors.notes.message)}</p>}
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
