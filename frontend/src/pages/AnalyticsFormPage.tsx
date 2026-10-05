// JARVIS App — AnalyticsFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnalytics, getAnalytics, updateAnalytics } from '@/lib/apiClient';
import type { AnalyticsCreate, AnalyticsUpdate } from '@/types/api';
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
  "title": z.string().min(1, 'Required'),
  "description": optFromInput(z.string().optional()),
  "status": z.enum(["active", "inactive", "archived"]),
});

type FormValues = z.infer<typeof schema>;

export default function AnalyticsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const existing = useQuery({
    queryKey: ["analytics", recordId],
    queryFn: () => getAnalytics(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "title": "",
    "description": "",
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateAnalytics(recordId, values as AnalyticsUpdate) : createAnalytics(values as AnalyticsCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      navigate('/analytics');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Analytic' : 'New Analytic'}</h1>
        <Link to="/analytics" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
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
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register("status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
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
