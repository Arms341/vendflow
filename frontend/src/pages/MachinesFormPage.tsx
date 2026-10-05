// JARVIS App — MachinesFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createMachines, getMachines, listLocations, listOperators, updateMachines } from '@/lib/apiClient';
import type { MachineCreate, MachineUpdate } from '@/types/api';
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
  "serial_number": z.string().min(1, 'Required'),
  "machine_type": z.enum(["ice", "soda", "candy", "combo"]),
  "name": optFromInput(z.string().optional()),
  "manufacturer": optFromInput(z.string().optional()),
  "model": optFromInput(z.string().optional()),
  "status": z.enum(["active", "inactive", "maintenance", "offline"]),
  "operator_id": numFromInput(z.number().int().optional()),
  "location_id": numFromInput(z.number().int().optional()),
  "terminal_id": optFromInput(z.string().optional()),
  "pi_device_id": optFromInput(z.string().optional()),
  "sim_iccid": optFromInput(z.string().optional()),
  "firmware_version": optFromInput(z.string().optional()),
  "temperature": numFromInput(z.number().optional()),
  "is_online": z.boolean().default(false),
  "is_active": z.boolean().default(true),
  "edge_mode": z.enum(["im30_only", "pi_im30", "pi_only", "un20_only"]),
  "connectivity_type": z.enum(["cellular", "wifi", "ethernet"]),
  "card_markup_pct": numFromInput(z.number().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function MachinesFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const operatorIdOptions = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });
  const locationIdOptions = useQuery({ queryKey: ["locations"], queryFn: () => listLocations() });

  const existing = useQuery({
    queryKey: ["machines", recordId],
    queryFn: () => getMachines(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "serial_number": "",
    "name": "",
    "manufacturer": "",
    "model": "",
    "terminal_id": "",
    "pi_device_id": "",
    "sim_iccid": "",
    "firmware_version": "",
    "is_online": false,
    "is_active": true,
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateMachines(recordId, values as MachineUpdate) : createMachines(values as MachineCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      navigate('/machines');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Machine' : 'New Machine'}</h1>
        <Link to="/machines" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">Serial Number *</label>
          <input type="text" {...register("serial_number")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.serial_number && <p className="text-xs text-red-600 mt-1">{String(errors.serial_number.message)}</p>}
        </div>
        <div>
          <label htmlFor="machine_type" className="block text-sm font-medium text-gray-700">Machine Type</label>
          <select {...register("machine_type")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="ice">Ice</option>
            <option value="soda">Soda</option>
            <option value="candy">Candy</option>
            <option value="combo">Combo</option>
          </select>
        {errors.machine_type && <p className="text-xs text-red-600 mt-1">{String(errors.machine_type.message)}</p>}
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" {...register("name")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.name && <p className="text-xs text-red-600 mt-1">{String(errors.name.message)}</p>}
        </div>
        <div>
          <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">Manufacturer</label>
          <input type="text" {...register("manufacturer")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.manufacturer && <p className="text-xs text-red-600 mt-1">{String(errors.manufacturer.message)}</p>}
        </div>
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
          <input type="text" {...register("model")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.model && <p className="text-xs text-red-600 mt-1">{String(errors.model.message)}</p>}
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select {...register("status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
        {errors.status && <p className="text-xs text-red-600 mt-1">{String(errors.status.message)}</p>}
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
        <div>
          <label htmlFor="location_id" className="block text-sm font-medium text-gray-700">Location</label>
          <select {...register("location_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(locationIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.name ?? o.id)}</option>
            ))}
          </select>
        {errors.location_id && <p className="text-xs text-red-600 mt-1">{String(errors.location_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="terminal_id" className="block text-sm font-medium text-gray-700">Terminal</label>
          <input type="text" {...register("terminal_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.terminal_id && <p className="text-xs text-red-600 mt-1">{String(errors.terminal_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="pi_device_id" className="block text-sm font-medium text-gray-700">Pi Device</label>
          <input type="text" {...register("pi_device_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.pi_device_id && <p className="text-xs text-red-600 mt-1">{String(errors.pi_device_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="sim_iccid" className="block text-sm font-medium text-gray-700">Sim Iccid</label>
          <input type="text" {...register("sim_iccid")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.sim_iccid && <p className="text-xs text-red-600 mt-1">{String(errors.sim_iccid.message)}</p>}
        </div>
        <div>
          <label htmlFor="firmware_version" className="block text-sm font-medium text-gray-700">Firmware Version</label>
          <input type="text" {...register("firmware_version")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.firmware_version && <p className="text-xs text-red-600 mt-1">{String(errors.firmware_version.message)}</p>}
        </div>
        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">Temperature</label>
          <input type="number" step="any" {...register("temperature")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.temperature && <p className="text-xs text-red-600 mt-1">{String(errors.temperature.message)}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <input id="is_online" type="checkbox" {...register("is_online")} className="h-4 w-4" />
          <label htmlFor="is_online" className="text-sm font-medium text-gray-700">Is Online</label>
        </div>
        <div className="flex items-center space-x-2">
          <input id="is_active" type="checkbox" {...register("is_active")} className="h-4 w-4" />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Is Active</label>
        </div>
        <div>
          <label htmlFor="edge_mode" className="block text-sm font-medium text-gray-700">Edge Mode</label>
          <select {...register("edge_mode")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="im30_only">Im30 Only</option>
            <option value="pi_im30">Pi Im30</option>
            <option value="pi_only">Pi Only</option>
            <option value="un20_only">Un20 Only</option>
          </select>
        {errors.edge_mode && <p className="text-xs text-red-600 mt-1">{String(errors.edge_mode.message)}</p>}
        </div>
        <div>
          <label htmlFor="connectivity_type" className="block text-sm font-medium text-gray-700">Connectivity Type</label>
          <select {...register("connectivity_type")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="cellular">Cellular</option>
            <option value="wifi">Wifi</option>
            <option value="ethernet">Ethernet</option>
          </select>
        {errors.connectivity_type && <p className="text-xs text-red-600 mt-1">{String(errors.connectivity_type.message)}</p>}
        </div>
        <div>
          <label htmlFor="card_markup_pct" className="block text-sm font-medium text-gray-700">Card Markup Pct</label>
          <input type="number" step="any" {...register("card_markup_pct")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.card_markup_pct && <p className="text-xs text-red-600 mt-1">{String(errors.card_markup_pct.message)}</p>}
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
