// JARVIS App — LocationsFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createLocations, getLocations, listLandowners, listOperators, updateLocations } from '@/lib/apiClient';
import type { LocationCreate, LocationUpdate } from '@/types/api';
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
  "address": optFromInput(z.string().optional()),
  "city": optFromInput(z.string().optional()),
  "state": optFromInput(z.string().optional()),
  "zip_code": optFromInput(z.string().optional()),
  "latitude": numFromInput(z.number().optional()),
  "longitude": numFromInput(z.number().optional()),
  "location_type": optFromInput(z.string().optional()),
  "contact_name": optFromInput(z.string().optional()),
  "contact_phone": optFromInput(z.string().optional()),
  "notes": optFromInput(z.string().optional()),
  "is_active": z.boolean().default(true),
  "landowner_id": numFromInput(z.number().int().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function LocationsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const operatorIdOptions = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });
  const landownerIdOptions = useQuery({ queryKey: ["landowners"], queryFn: () => listLandowners() });

  const existing = useQuery({
    queryKey: ["locations", recordId],
    queryFn: () => getLocations(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "name": "",
    "address": "",
    "city": "",
    "state": "",
    "zip_code": "",
    "location_type": "",
    "contact_name": "",
    "contact_phone": "",
    "notes": "",
    "is_active": true,
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateLocations(recordId, values as LocationUpdate) : createLocations(values as LocationCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      navigate('/locations');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Location' : 'New Location'}</h1>
        <Link to="/locations" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
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
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
          <input type="number" step="any" {...register("latitude")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.latitude && <p className="text-xs text-red-600 mt-1">{String(errors.latitude.message)}</p>}
        </div>
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
          <input type="number" step="any" {...register("longitude")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.longitude && <p className="text-xs text-red-600 mt-1">{String(errors.longitude.message)}</p>}
        </div>
        <div>
          <label htmlFor="location_type" className="block text-sm font-medium text-gray-700">Location Type</label>
          <input type="text" {...register("location_type")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.location_type && <p className="text-xs text-red-600 mt-1">{String(errors.location_type.message)}</p>}
        </div>
        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">Contact Name</label>
          <input type="text" {...register("contact_name")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.contact_name && <p className="text-xs text-red-600 mt-1">{String(errors.contact_name.message)}</p>}
        </div>
        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
          <input type="text" {...register("contact_phone")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.contact_phone && <p className="text-xs text-red-600 mt-1">{String(errors.contact_phone.message)}</p>}
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <input type="text" {...register("notes")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.notes && <p className="text-xs text-red-600 mt-1">{String(errors.notes.message)}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <input id="is_active" type="checkbox" {...register("is_active")} className="h-4 w-4" />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Is Active</label>
        </div>
        <div>
          <label htmlFor="landowner_id" className="block text-sm font-medium text-gray-700">Landowner</label>
          <select {...register("landowner_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(landownerIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.name ?? o.id)}</option>
            ))}
          </select>
        {errors.landowner_id && <p className="text-xs text-red-600 mt-1">{String(errors.landowner_id.message)}</p>}
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
