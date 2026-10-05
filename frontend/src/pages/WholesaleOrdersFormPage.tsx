// JARVIS App — WholesaleOrdersFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createWholesaleOrders, getWholesaleOrders, listMachines, listOperators, listStandingOrders, listTransactions, updateWholesaleOrders } from '@/lib/apiClient';
import type { WholesaleOrderCreate, WholesaleOrderUpdate } from '@/types/api';
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
  "standing_order_id": numFromInput(z.number().int().optional()),
  "machine_id": numFromInput(z.number().int().optional()),
  "transaction_id": numFromInput(z.number().int().optional()),
  "quantity_bags": numFromInput(z.number().int().optional()),
  "quantity_lbs": numFromInput(z.number().optional()),
  "unit_price": numFromInput(z.number().optional()),
  "subtotal": numFromInput(z.number().optional()),
  "fee_amount": numFromInput(z.number().optional()),
  "total": numFromInput(z.number().optional()),
  "payment_method": z.enum(["card_on_file", "account", "invoice", "cash"]),
  "payment_status": z.enum(["pending", "approved", "declined", "refunded"]),
  "payment_ref": optFromInput(z.string().optional()),
  "fulfillment_status": z.enum(["pending", "fulfilled", "cancelled"]),
  "idempotency_key": optFromInput(z.string().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function WholesaleOrdersFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const operatorIdOptions = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });
  const standingOrderIdOptions = useQuery({ queryKey: ["standing_orders"], queryFn: () => listStandingOrders() });
  const machineIdOptions = useQuery({ queryKey: ["machines"], queryFn: () => listMachines() });
  const transactionIdOptions = useQuery({ queryKey: ["transactions"], queryFn: () => listTransactions() });

  const existing = useQuery({
    queryKey: ["wholesale_orders", recordId],
    queryFn: () => getWholesaleOrders(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "payment_ref": "",
    "idempotency_key": "",
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateWholesaleOrders(recordId, values as WholesaleOrderUpdate) : createWholesaleOrders(values as WholesaleOrderCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wholesale_orders"] });
      navigate('/wholesale-orders');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Wholesale Orders' : 'New Wholesale Orders'}</h1>
        <Link to="/wholesale-orders" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
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
          <label htmlFor="standing_order_id" className="block text-sm font-medium text-gray-700">Standing Order</label>
          <select {...register("standing_order_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(standingOrderIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.frequency ?? o.id)}</option>
            ))}
          </select>
        {errors.standing_order_id && <p className="text-xs text-red-600 mt-1">{String(errors.standing_order_id.message)}</p>}
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
          <label htmlFor="transaction_id" className="block text-sm font-medium text-gray-700">Transaction</label>
          <select {...register("transaction_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(transactionIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.amount ?? o.id)}</option>
            ))}
          </select>
        {errors.transaction_id && <p className="text-xs text-red-600 mt-1">{String(errors.transaction_id.message)}</p>}
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
          <label htmlFor="subtotal" className="block text-sm font-medium text-gray-700">Subtotal</label>
          <input type="number" step="any" {...register("subtotal")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.subtotal && <p className="text-xs text-red-600 mt-1">{String(errors.subtotal.message)}</p>}
        </div>
        <div>
          <label htmlFor="fee_amount" className="block text-sm font-medium text-gray-700">Fee Amount</label>
          <input type="number" step="any" {...register("fee_amount")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.fee_amount && <p className="text-xs text-red-600 mt-1">{String(errors.fee_amount.message)}</p>}
        </div>
        <div>
          <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total</label>
          <input type="number" step="any" {...register("total")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.total && <p className="text-xs text-red-600 mt-1">{String(errors.total.message)}</p>}
        </div>
        <div>
          <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select {...register("payment_method")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="card_on_file">Card On File</option>
            <option value="account">Account</option>
            <option value="invoice">Invoice</option>
            <option value="cash">Cash</option>
          </select>
        {errors.payment_method && <p className="text-xs text-red-600 mt-1">{String(errors.payment_method.message)}</p>}
        </div>
        <div>
          <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700">Payment Status</label>
          <select {...register("payment_status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="refunded">Refunded</option>
          </select>
        {errors.payment_status && <p className="text-xs text-red-600 mt-1">{String(errors.payment_status.message)}</p>}
        </div>
        <div>
          <label htmlFor="payment_ref" className="block text-sm font-medium text-gray-700">Payment Ref</label>
          <input type="text" {...register("payment_ref")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.payment_ref && <p className="text-xs text-red-600 mt-1">{String(errors.payment_ref.message)}</p>}
        </div>
        <div>
          <label htmlFor="fulfillment_status" className="block text-sm font-medium text-gray-700">Fulfillment Status</label>
          <select {...register("fulfillment_status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="pending">Pending</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        {errors.fulfillment_status && <p className="text-xs text-red-600 mt-1">{String(errors.fulfillment_status.message)}</p>}
        </div>
        <div>
          <label htmlFor="idempotency_key" className="block text-sm font-medium text-gray-700">Idempotency Key</label>
          <input type="text" {...register("idempotency_key")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.idempotency_key && <p className="text-xs text-red-600 mt-1">{String(errors.idempotency_key.message)}</p>}
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
