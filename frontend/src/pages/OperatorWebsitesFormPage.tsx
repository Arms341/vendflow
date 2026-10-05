// JARVIS App — OperatorWebsitesFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createOperatorWebsites, getOperatorWebsites, listOperators, updateOperatorWebsites } from '@/lib/apiClient';
import type { OperatorWebsiteCreate, OperatorWebsiteUpdate } from '@/types/api';
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
  "domain": optFromInput(z.string().optional()),
  "subdomain": optFromInput(z.string().optional()),
  "company_name": z.string().min(1, 'Required'),
  "tagline": optFromInput(z.string().optional()),
  "logo_url": optFromInput(z.string().optional()),
  "primary_color": optFromInput(z.string().optional()),
  "phone": optFromInput(z.string().optional()),
  "email": optFromInput(z.string().optional()),
  "about_text": optFromInput(z.string().optional()),
  "services_json": optFromInput(z.string().optional()),
  "chatbot_enabled": z.boolean().default(false),
  "chatbot_greeting": optFromInput(z.string().optional()),
  "is_published": z.boolean().default(false),
  "template_id": optFromInput(z.string().optional()),
});

type FormValues = z.infer<typeof schema>;

export default function OperatorWebsitesFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const operatorIdOptions = useQuery({ queryKey: ["operators"], queryFn: () => listOperators() });

  const existing = useQuery({
    queryKey: ["operator_websites", recordId],
    queryFn: () => getOperatorWebsites(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "domain": "",
    "subdomain": "",
    "company_name": "",
    "tagline": "",
    "logo_url": "",
    "primary_color": "",
    "phone": "",
    "email": "",
    "about_text": "",
    "services_json": "",
    "chatbot_enabled": false,
    "chatbot_greeting": "",
    "is_published": false,
    "template_id": "",
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateOperatorWebsites(recordId, values as OperatorWebsiteUpdate) : createOperatorWebsites(values as OperatorWebsiteCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operator_websites"] });
      navigate('/operator-websites');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Operator Websites' : 'New Operator Websites'}</h1>
        <Link to="/operator-websites" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
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
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Domain</label>
          <input type="text" {...register("domain")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.domain && <p className="text-xs text-red-600 mt-1">{String(errors.domain.message)}</p>}
        </div>
        <div>
          <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">Subdomain</label>
          <input type="text" {...register("subdomain")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.subdomain && <p className="text-xs text-red-600 mt-1">{String(errors.subdomain.message)}</p>}
        </div>
        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">Company Name *</label>
          <input type="text" {...register("company_name")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.company_name && <p className="text-xs text-red-600 mt-1">{String(errors.company_name.message)}</p>}
        </div>
        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">Tagline</label>
          <input type="text" {...register("tagline")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.tagline && <p className="text-xs text-red-600 mt-1">{String(errors.tagline.message)}</p>}
        </div>
        <div>
          <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">Logo Url</label>
          <input type="text" {...register("logo_url")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.logo_url && <p className="text-xs text-red-600 mt-1">{String(errors.logo_url.message)}</p>}
        </div>
        <div>
          <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700">Primary Color</label>
          <input type="text" {...register("primary_color")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.primary_color && <p className="text-xs text-red-600 mt-1">{String(errors.primary_color.message)}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input type="text" {...register("phone")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.phone && <p className="text-xs text-red-600 mt-1">{String(errors.phone.message)}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="text" {...register("email")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.email && <p className="text-xs text-red-600 mt-1">{String(errors.email.message)}</p>}
        </div>
        <div>
          <label htmlFor="about_text" className="block text-sm font-medium text-gray-700">About Text</label>
          <input type="text" {...register("about_text")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.about_text && <p className="text-xs text-red-600 mt-1">{String(errors.about_text.message)}</p>}
        </div>
        <div>
          <label htmlFor="services_json" className="block text-sm font-medium text-gray-700">Services Json</label>
          <input type="text" {...register("services_json")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.services_json && <p className="text-xs text-red-600 mt-1">{String(errors.services_json.message)}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <input id="chatbot_enabled" type="checkbox" {...register("chatbot_enabled")} className="h-4 w-4" />
          <label htmlFor="chatbot_enabled" className="text-sm font-medium text-gray-700">Chatbot Enabled</label>
        </div>
        <div>
          <label htmlFor="chatbot_greeting" className="block text-sm font-medium text-gray-700">Chatbot Greeting</label>
          <input type="text" {...register("chatbot_greeting")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.chatbot_greeting && <p className="text-xs text-red-600 mt-1">{String(errors.chatbot_greeting.message)}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <input id="is_published" type="checkbox" {...register("is_published")} className="h-4 w-4" />
          <label htmlFor="is_published" className="text-sm font-medium text-gray-700">Is Published</label>
        </div>
        <div>
          <label htmlFor="template_id" className="block text-sm font-medium text-gray-700">Template</label>
          <input type="text" {...register("template_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.template_id && <p className="text-xs text-red-600 mt-1">{String(errors.template_id.message)}</p>}
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
