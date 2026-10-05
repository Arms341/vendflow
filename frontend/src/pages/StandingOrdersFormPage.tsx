// JARVIS App — StandingOrdersFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createStandingOrders, getStandingOrders, listMachines, listOperators, updateStandingOrders } from '@/lib/apiClient';
import type { StandingOrderCreate, StandingOrderUpdate } from '@/types/api';
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
  "account_id": numFromInput(z.number().int().optional()),
  "machine_id": numFromInput(z.number().int().optional()),
  "frequency": z.enum(["daily", "weekly", "biweekly", "monthly"]),
  "quantity_bags": numFromInput(z.number().int().optional()),
  "quantity_lbs": numFromInput(z.number().optional()),
  "unit_price": numFromInput(z.number().optional()),
  "fulfillment_method": optFromInput(z.string().optional()),
  "status": z.enum(["active", "paused", "cancelled"]),
  "is_active": z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export default function StandingOrdersFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const operatorIdOptions = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });
  const machineIdOptions = useQuery({ queryKey: ["machines"], queryFn: () => listMachines() });

  const existing = useQuery({
    queryKey: ["standing_orders", recordId],
    queryFn: () => getStandingOrders(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "fulfillment_method": "",
    "is_active": true,
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateStandingOrders(recordId, values as StandingOrderUpdate) : createStandingOrders(values as StandingOrderCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["standing_orders"] });
      navigate('/standing-orders');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Standing Orders' : 'New Standing Orders'}</h1>
        <Link to="/standing-orders" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
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
          <label htmlFor="account_id" className="block text-sm font-medium text-gray-700">Account</label>
          <input type="number" {...register("account_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.account_id && <p className="text-xs text-red-600 mt-1">{String(errors.account_id.message)}</p>}
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
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
          <select {...register("frequency")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
          </select>
        {errors.frequency && <p className="text-xs text-red-600 mt-1">{String(errors.frequency.message)}</p>}
        </div>
        <div>
          <label htmlFor="quantity_bags" className="block text-sm font-medium text-gray-700">Quantity Bags</label>
          <input type="number" {...register("quantity_bags")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.quantity_bags && <p className="text-xs text-red-600 mt-1">{String(errors.quantity_bags.message)}</p>}
        </div>
        <div>
          <label htmlFor="quantity_lbs" className="block text-sm font-medium text-gray-700">Quantity Lbs</label>
          <input type="number" step="any" {...register("quantity_lbs")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.quantity_lbs && <p className="text-xs text-red-600 mt-1">{String(errors.quantity_lbs.message)}</p>}
        </div>
        <div>
          <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700">Unit Price</label>
          <input type="number" step="any" {...register("unit_price")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.unit_price && <p className="text-xs text-red-600 mt-1">{String(errors.unit_price.message)}</p>}
        </div>
        <div>
          <label htmlFor="fulfillment_method" className="block text-sm font-medium text-gray-700">Fulfillment Method</label>
          <input type="text" {...register("fulfillment_method")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.fulfillment_method && <p className="text-xs text-red-600 mt-1">{String(errors.fulfillment_method.message)}</p>}
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register("status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        {errors.status && <p className="text-xs text-red-600 mt-1">{String(errors.status.message)}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <input id="is_active" type="checkbox" {...register("is_active")} className="h-4 w-4" />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Is Active</label>
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
