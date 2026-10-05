// JARVIS App — DailyReportsFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createDailyReports, getDailyReports, listMachines, updateDailyReports } from '@/lib/apiClient';
import type { DailyReportCreate, DailyReportUpdate } from '@/types/api';
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
  "total_transactions": numFromInput(z.number().int().optional()),
  "total_revenue": numFromInput(z.number().optional()),
  "card_revenue": numFromInput(z.number().optional()),
  "cash_revenue": numFromInput(z.number().optional()),
  "items_sold": numFromInput(z.number().int().optional()),
  "avg_transaction": numFromInput(z.number().optional()),
  "uptime_hours": numFromInput(z.number().optional()),
  "alerts_count": numFromInput(z.number().int().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function DailyReportsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const machineIdOptions = useQuery({ queryKey: ["machines"], queryFn: () => listMachines() });

  const existing = useQuery({
    queryKey: ["daily_reports", recordId],
    queryFn: () => getDailyReports(recordId),
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
      isEdit ? updateDailyReports(recordId, values as DailyReportUpdate) : createDailyReports(values as DailyReportCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_reports"] });
      navigate('/daily-reports');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Daily Reports' : 'New Daily Reports'}</h1>
        <Link to="/daily-reports" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
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
          <label htmlFor="total_transactions" className="block text-sm font-medium text-gray-700">Total Transactions</label>
          <input type="number" {...register("total_transactions")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.total_transactions && <p className="text-xs text-red-600 mt-1">{String(errors.total_transactions.message)}</p>}
        </div>
        <div>
          <label htmlFor="total_revenue" className="block text-sm font-medium text-gray-700">Total Revenue</label>
          <input type="number" step="any" {...register("total_revenue")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.total_revenue && <p className="text-xs text-red-600 mt-1">{String(errors.total_revenue.message)}</p>}
        </div>
        <div>
          <label htmlFor="card_revenue" className="block text-sm font-medium text-gray-700">Card Revenue</label>
          <input type="number" step="any" {...register("card_revenue")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.card_revenue && <p className="text-xs text-red-600 mt-1">{String(errors.card_revenue.message)}</p>}
        </div>
        <div>
          <label htmlFor="cash_revenue" className="block text-sm font-medium text-gray-700">Cash Revenue</label>
          <input type="number" step="any" {...register("cash_revenue")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.cash_revenue && <p className="text-xs text-red-600 mt-1">{String(errors.cash_revenue.message)}</p>}
        </div>
        <div>
          <label htmlFor="items_sold" className="block text-sm font-medium text-gray-700">Items Sold</label>
          <input type="number" {...register("items_sold")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.items_sold && <p className="text-xs text-red-600 mt-1">{String(errors.items_sold.message)}</p>}
        </div>
        <div>
          <label htmlFor="avg_transaction" className="block text-sm font-medium text-gray-700">Avg Transaction</label>
          <input type="number" step="any" {...register("avg_transaction")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.avg_transaction && <p className="text-xs text-red-600 mt-1">{String(errors.avg_transaction.message)}</p>}
        </div>
        <div>
          <label htmlFor="uptime_hours" className="block text-sm font-medium text-gray-700">Uptime Hours</label>
          <input type="number" step="any" {...register("uptime_hours")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.uptime_hours && <p className="text-xs text-red-600 mt-1">{String(errors.uptime_hours.message)}</p>}
        </div>
        <div>
          <label htmlFor="alerts_count" className="block text-sm font-medium text-gray-700">Alerts Count</label>
          <input type="number" {...register("alerts_count")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.alerts_count && <p className="text-xs text-red-600 mt-1">{String(errors.alerts_count.message)}</p>}
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
