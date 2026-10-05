// JARVIS App — LandownersFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createLandowners, getLandowners, listOperators, updateLandowners } from '@/lib/apiClient';
import type { LandownerCreate, LandownerUpdate } from '@/types/api';
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
  "name": z.string().min(1, 'Required'),
  "business_name": optFromInput(z.string().optional()),
  "contact_name": optFromInput(z.string().optional()),
  "contact_email": optFromInput(z.string().optional()),
  "contact_phone": optFromInput(z.string().optional()),
  "address": optFromInput(z.string().optional()),
  "city": optFromInput(z.string().optional()),
  "state": optFromInput(z.string().optional()),
  "zip_code": optFromInput(z.string().optional()),
  "tax_id_last_four": optFromInput(z.string().optional()),
  "payout_method": optFromInput(z.string().optional()),
  "payout_token_ref": optFromInput(z.string().optional()),
  "payout_last_four": optFromInput(z.string().optional()),
  "status": z.enum(["active", "inactive"]),
  "is_active": z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export default function LandownersFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const operatorIdOptions = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });

  const existing = useQuery({
    queryKey: ["landowners", recordId],
    queryFn: () => getLandowners(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "name": "",
    "business_name": "",
    "contact_name": "",
    "contact_email": "",
    "contact_phone": "",
    "address": "",
    "city": "",
    "state": "",
    "zip_code": "",
    "tax_id_last_four": "",
    "payout_method": "",
    "payout_token_ref": "",
    "payout_last_four": "",
    "is_active": true,
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateLandowners(recordId, values as LandownerUpdate) : createLandowners(values as LandownerCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landowners"] });
      navigate('/landowners');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Landowner' : 'New Landowner'}</h1>
        <Link to="/landowners" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
          <input type="text" {...register("name")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.name && <p className="text-xs text-red-600 mt-1">{String(errors.name.message)}</p>}
        </div>
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">Business Name</label>
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
          <label htmlFor="tax_id_last_four" className="block text-sm font-medium text-gray-700">Tax Id Last Four</label>
          <input type="text" {...register("tax_id_last_four")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.tax_id_last_four && <p className="text-xs text-red-600 mt-1">{String(errors.tax_id_last_four.message)}</p>}
        </div>
        <div>
          <label htmlFor="payout_method" className="block text-sm font-medium text-gray-700">Payout Method</label>
          <input type="text" {...register("payout_method")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.payout_method && <p className="text-xs text-red-600 mt-1">{String(errors.payout_method.message)}</p>}
        </div>
        <div>
          <label htmlFor="payout_token_ref" className="block text-sm font-medium text-gray-700">Payout Token Ref</label>
          <input type="text" {...register("payout_token_ref")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.payout_token_ref && <p className="text-xs text-red-600 mt-1">{String(errors.payout_token_ref.message)}</p>}
        </div>
        <div>
          <label htmlFor="payout_last_four" className="block text-sm font-medium text-gray-700">Payout Last Four</label>
          <input type="text" {...register("payout_last_four")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.payout_last_four && <p className="text-xs text-red-600 mt-1">{String(errors.payout_last_four.message)}</p>}
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register("status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
