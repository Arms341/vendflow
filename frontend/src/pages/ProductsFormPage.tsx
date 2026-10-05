// JARVIS App — ProductsFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createProducts, getProducts, listOperators, updateProducts } from '@/lib/apiClient';
import type { ProductCreate, ProductUpdate } from '@/types/api';
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
  "sku": optFromInput(z.string().optional()),
  "category": optFromInput(z.string().optional()),
  "unit_cost": numFromInput(z.number().optional()),
  "retail_price": numFromInput(z.number().optional()),
  "par_level": numFromInput(z.number().int().optional()),
  "image_url": optFromInput(z.string().optional()),
  "is_active": z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export default function ProductsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const operatorIdOptions = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });

  const existing = useQuery({
    queryKey: ["products", recordId],
    queryFn: () => getProducts(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "name": "",
    "sku": "",
    "category": "",
    "image_url": "",
    "is_active": true,
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateProducts(recordId, values as ProductUpdate) : createProducts(values as ProductCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate('/products');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Product' : 'New Product'}</h1>
        <Link to="/products" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
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
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">Sku</label>
          <input type="text" {...register("sku")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.sku && <p className="text-xs text-red-600 mt-1">{String(errors.sku.message)}</p>}
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input type="text" {...register("category")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.category && <p className="text-xs text-red-600 mt-1">{String(errors.category.message)}</p>}
        </div>
        <div>
          <label htmlFor="unit_cost" className="block text-sm font-medium text-gray-700">Unit Cost</label>
          <input type="number" step="any" {...register("unit_cost")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.unit_cost && <p className="text-xs text-red-600 mt-1">{String(errors.unit_cost.message)}</p>}
        </div>
        <div>
          <label htmlFor="retail_price" className="block text-sm font-medium text-gray-700">Retail Price</label>
          <input type="number" step="any" {...register("retail_price")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.retail_price && <p className="text-xs text-red-600 mt-1">{String(errors.retail_price.message)}</p>}
        </div>
        <div>
          <label htmlFor="par_level" className="block text-sm font-medium text-gray-700">Par Level</label>
          <input type="number" {...register("par_level")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.par_level && <p className="text-xs text-red-600 mt-1">{String(errors.par_level.message)}</p>}
        </div>
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image Url</label>
          <input type="text" {...register("image_url")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.image_url && <p className="text-xs text-red-600 mt-1">{String(errors.image_url.message)}</p>}
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
