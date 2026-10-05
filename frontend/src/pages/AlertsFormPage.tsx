// JARVIS App — AlertsFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAlerts, getAlerts, listMachines, updateAlerts } from '@/lib/apiClient';
import type { AlertCreate, AlertUpdate } from '@/types/api';
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
  "machine_id": numFromInput(z.number().int().optional()),
  "alert_type": z.string().min(1, 'Required'),
  "severity": z.enum(["low", "medium", "high", "critical"]),
  "message": z.string().min(1, 'Required'),
  "is_acknowledged": z.boolean().default(false),
  "acknowledged_by": numFromInput(z.number().int().optional()),
  "data_json": optFromInput(z.string().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function AlertsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const machineIdOptions = useQuery({ queryKey: ["machines"], queryFn: () => listMachines() });

  const existing = useQuery({
    queryKey: ["alerts", recordId],
    queryFn: () => getAlerts(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "alert_type": "",
    "message": "",
    "is_acknowledged": false,
    "data_json": "",
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateAlerts(recordId, values as AlertUpdate) : createAlerts(values as AlertCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      navigate('/alerts');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Alert' : 'New Alert'}</h1>
        <Link to="/alerts" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
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
          <label htmlFor="alert_type" className="block text-sm font-medium text-gray-700">Alert Type *</label>
          <input type="text" {...register("alert_type")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.alert_type && <p className="text-xs text-red-600 mt-1">{String(errors.alert_type.message)}</p>}
        </div>
        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700">Severity</label>
          <select {...register("severity")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        {errors.severity && <p className="text-xs text-red-600 mt-1">{String(errors.severity.message)}</p>}
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message *</label>
          <input type="text" {...register("message")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.message && <p className="text-xs text-red-600 mt-1">{String(errors.message.message)}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <input id="is_acknowledged" type="checkbox" {...register("is_acknowledged")} className="h-4 w-4" />
          <label htmlFor="is_acknowledged" className="text-sm font-medium text-gray-700">Is Acknowledged</label>
        </div>
        <div>
          <label htmlFor="acknowledged_by" className="block text-sm font-medium text-gray-700">Acknowledged By</label>
          <input type="number" {...register("acknowledged_by")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.acknowledged_by && <p className="text-xs text-red-600 mt-1">{String(errors.acknowledged_by.message)}</p>}
        </div>
        <div>
          <label htmlFor="data_json" className="block text-sm font-medium text-gray-700">Data Json</label>
          <input type="text" {...register("data_json")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.data_json && <p className="text-xs text-red-600 mt-1">{String(errors.data_json.message)}</p>}
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
