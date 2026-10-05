// JARVIS App — TransactionsFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransactions, getTransactions, listMachines, listProducts, updateTransactions } from '@/lib/apiClient';
import type { TransactionCreate, TransactionUpdate } from '@/types/api';
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
  "product_id": numFromInput(z.number().int().optional()),
  "amount": numFromInput(z.number()),
  "payment_method": optFromInput(z.string().optional()),
  "payment_status": optFromInput(z.string().optional()),
  "payment_ref": optFromInput(z.string().optional()),
  "card_brand": optFromInput(z.string().optional()),
  "card_last_four": optFromInput(z.string().optional()),
  "terminal_id": optFromInput(z.string().optional()),
  "slot_number": numFromInput(z.number().int().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function TransactionsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const machineIdOptions = useQuery({ queryKey: ["machines"], queryFn: () => listMachines() });
  const productIdOptions = useQuery({ queryKey: ["products"], queryFn: () => listProducts() });

  const existing = useQuery({
    queryKey: ["transactions", recordId],
    queryFn: () => getTransactions(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "payment_method": "",
    "payment_status": "",
    "payment_ref": "",
    "card_brand": "",
    "card_last_four": "",
    "terminal_id": "",
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateTransactions(recordId, values as TransactionUpdate) : createTransactions(values as TransactionCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      navigate('/transactions');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Transaction' : 'New Transaction'}</h1>
        <Link to="/transactions" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
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
          <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Product</label>
          <select {...register("product_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(productIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.name ?? o.id)}</option>
            ))}
          </select>
        {errors.product_id && <p className="text-xs text-red-600 mt-1">{String(errors.product_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount *</label>
          <input type="number" step="any" {...register("amount")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.amount && <p className="text-xs text-red-600 mt-1">{String(errors.amount.message)}</p>}
        </div>
        <div>
          <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">Payment Method</label>
          <input type="text" {...register("payment_method")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.payment_method && <p className="text-xs text-red-600 mt-1">{String(errors.payment_method.message)}</p>}
        </div>
        <div>
          <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700">Payment Status</label>
          <input type="text" {...register("payment_status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.payment_status && <p className="text-xs text-red-600 mt-1">{String(errors.payment_status.message)}</p>}
        </div>
        <div>
          <label htmlFor="payment_ref" className="block text-sm font-medium text-gray-700">Payment Ref</label>
          <input type="text" {...register("payment_ref")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.payment_ref && <p className="text-xs text-red-600 mt-1">{String(errors.payment_ref.message)}</p>}
        </div>
        <div>
          <label htmlFor="card_brand" className="block text-sm font-medium text-gray-700">Card Brand</label>
          <input type="text" {...register("card_brand")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.card_brand && <p className="text-xs text-red-600 mt-1">{String(errors.card_brand.message)}</p>}
        </div>
        <div>
          <label htmlFor="card_last_four" className="block text-sm font-medium text-gray-700">Card Last Four</label>
          <input type="text" {...register("card_last_four")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.card_last_four && <p className="text-xs text-red-600 mt-1">{String(errors.card_last_four.message)}</p>}
        </div>
        <div>
          <label htmlFor="terminal_id" className="block text-sm font-medium text-gray-700">Terminal</label>
          <input type="text" {...register("terminal_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.terminal_id && <p className="text-xs text-red-600 mt-1">{String(errors.terminal_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="slot_number" className="block text-sm font-medium text-gray-700">Slot Number</label>
          <input type="number" {...register("slot_number")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.slot_number && <p className="text-xs text-red-600 mt-1">{String(errors.slot_number.message)}</p>}
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
