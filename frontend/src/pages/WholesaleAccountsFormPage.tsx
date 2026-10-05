// JARVIS App — WholesaleAccountsFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createWholesaleAccounts, getWholesaleAccounts, listOperators, updateWholesaleAccounts } from '@/lib/apiClient';
import type { WholesaleAccountCreate, WholesaleAccountUpdate } from '@/types/api';
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
  "business_name": z.string().min(1, 'Required'),
  "contact_name": optFromInput(z.string().optional()),
  "contact_email": optFromInput(z.string().optional()),
  "contact_phone": optFromInput(z.string().optional()),
  "address": optFromInput(z.string().optional()),
  "city": optFromInput(z.string().optional()),
  "state": optFromInput(z.string().optional()),
  "zip_code": optFromInput(z.string().optional()),
  "account_type": z.enum(["wholesale", "distributor", "retail"]),
  "billing_terms": optFromInput(z.string().optional()),
  "price_per_bag": numFromInput(z.number().optional()),
  "price_per_lb": numFromInput(z.number().optional()),
  "credit_limit": numFromInput(z.number().optional()),
  "balance": numFromInput(z.number().optional()),
  "card_on_file_token_ref": optFromInput(z.string().optional()),
  "card_brand": optFromInput(z.string().optional()),
  "card_last_four": optFromInput(z.string().optional()),
  "status": z.enum(["active", "inactive", "suspended"]),
  "is_active": z.boolean().default(true),
  "operator_id": numFromInput(z.number().int().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function WholesaleAccountsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const operatorIdOptions = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });

  const existing = useQuery({
    queryKey: ["wholesale_accounts", recordId],
    queryFn: () => getWholesaleAccounts(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "business_name": "",
    "contact_name": "",
    "contact_email": "",
    "contact_phone": "",
    "address": "",
    "city": "",
    "state": "",
    "zip_code": "",
    "billing_terms": "",
    "card_on_file_token_ref": "",
    "card_brand": "",
    "card_last_four": "",
    "is_active": true,
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateWholesaleAccounts(recordId, values as WholesaleAccountUpdate) : createWholesaleAccounts(values as WholesaleAccountCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wholesale_accounts"] });
      navigate('/wholesale-accounts');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Wholesale Accounts' : 'New Wholesale Accounts'}</h1>
        <Link to="/wholesale-accounts" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">Business Name *</label>
          <input type="text" {...register("business_name")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.business_name && <p className="text-xs text-red-600 mt-1">{String(errors.business_name.message)}</p>}
        </div>
        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">Contact Name</label>
          <input type="text" {...register("contact_name")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.contact_name && <p className="text-xs text-red-600 mt-1">{String(errors.contact_name.message)}</p>}
        </div>
        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input type="text" {...register("contact_email")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.contact_email && <p className="text-xs text-red-600 mt-1">{String(errors.contact_email.message)}</p>}
        </div>
        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
          <input type="text" {...register("contact_phone")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.contact_phone && <p className="text-xs text-red-600 mt-1">{String(errors.contact_phone.message)}</p>}
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input type="text" {...register("address")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.address && <p className="text-xs text-red-600 mt-1">{String(errors.address.message)}</p>}
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <input type="text" {...register("city")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.city && <p className="text-xs text-red-600 mt-1">{String(errors.city.message)}</p>}
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
          <input type="text" {...register("state")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.state && <p className="text-xs text-red-600 mt-1">{String(errors.state.message)}</p>}
        </div>
        <div>
          <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">Zip Code</label>
          <input type="text" {...register("zip_code")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.zip_code && <p className="text-xs text-red-600 mt-1">{String(errors.zip_code.message)}</p>}
        </div>
        <div>
          <label htmlFor="account_type" className="block text-sm font-medium text-gray-700">Account Type</label>
          <select {...register("account_type")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="wholesale">Wholesale</option>
            <option value="distributor">Distributor</option>
            <option value="retail">Retail</option>
          </select>
        {errors.account_type && <p className="text-xs text-red-600 mt-1">{String(errors.account_type.message)}</p>}
        </div>
        <div>
          <label htmlFor="billing_terms" className="block text-sm font-medium text-gray-700">Billing Terms</label>
          <input type="text" {...register("billing_terms")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.billing_terms && <p className="text-xs text-red-600 mt-1">{String(errors.billing_terms.message)}</p>}
        </div>
        <div>
          <label htmlFor="price_per_bag" className="block text-sm font-medium text-gray-700">Price Per Bag</label>
          <input type="number" step="any" {...register("price_per_bag")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.price_per_bag && <p className="text-xs text-red-600 mt-1">{String(errors.price_per_bag.message)}</p>}
        </div>
        <div>
          <label htmlFor="price_per_lb" className="block text-sm font-medium text-gray-700">Price Per Lb</label>
          <input type="number" step="any" {...register("price_per_lb")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.price_per_lb && <p className="text-xs text-red-600 mt-1">{String(errors.price_per_lb.message)}</p>}
        </div>
        <div>
          <label htmlFor="credit_limit" className="block text-sm font-medium text-gray-700">Credit Limit</label>
          <input type="number" step="any" {...register("credit_limit")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.credit_limit && <p className="text-xs text-red-600 mt-1">{String(errors.credit_limit.message)}</p>}
        </div>
        <div>
          <label htmlFor="balance" className="block text-sm font-medium text-gray-700">Balance</label>
          <input type="number" step="any" {...register("balance")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.balance && <p className="text-xs text-red-600 mt-1">{String(errors.balance.message)}</p>}
        </div>
        <div>
          <label htmlFor="card_on_file_token_ref" className="block text-sm font-medium text-gray-700">Card On File Token Ref</label>
          <input type="text" {...register("card_on_file_token_ref")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.card_on_file_token_ref && <p className="text-xs text-red-600 mt-1">{String(errors.card_on_file_token_ref.message)}</p>}
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
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register("status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        {errors.status && <p className="text-xs text-red-600 mt-1">{String(errors.status.message)}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <input id="is_active" type="checkbox" {...register("is_active")} className="h-4 w-4" />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Is Active</label>
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
