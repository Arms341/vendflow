// JARVIS App — EmailSendLogsFormPage (CONTRACT-FIRST form archetype: create + edit, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmailSendLogs, getEmailSendLogs, listLeads, updateEmailSendLogs } from '@/lib/apiClient';
import type { EmailSendLogCreate, EmailSendLogUpdate } from '@/types/api';
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
  "lead_id": numFromInput(z.number().int().optional()),
  "sequence_id": numFromInput(z.number().int().optional()),
  "step_number": numFromInput(z.number().int().optional()),
  "subject": optFromInput(z.string().optional()),
  "status": z.string().min(1, 'Required'),
});

type FormValues = z.infer<typeof schema>;

export default function EmailSendLogsFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const leadIdOptions = useQuery({ queryKey: ["leads"], queryFn: () => listLeads() });

  const existing = useQuery({
    queryKey: ["email_send_logs", recordId],
    queryFn: () => getEmailSendLogs(recordId),
    enabled: isEdit && Number.isFinite(recordId),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    "subject": "",
    "status": "",
  } as FormValues,
  });

  useEffect(() => {
    if (existing.data) reset(nullsToUndefined(existing.data) as unknown as FormValues);
  }, [existing.data, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit ? updateEmailSendLogs(recordId, values as EmailSendLogUpdate) : createEmailSendLogs(values as EmailSendLogCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email_send_logs"] });
      navigate('/email-send-logs');
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (isEdit && existing.isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Email Send Logs' : 'New Email Send Logs'}</h1>
        <Link to="/email-send-logs" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Cancel</Link>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label htmlFor="lead_id" className="block text-sm font-medium text-gray-700">Lead</label>
          <select {...register("lead_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select…</option>
            {(leadIdOptions.data ?? []).map((o: any) => (
              <option key={o.id} value={o.id ?? ''}>{String(o.business_name ?? o.id)}</option>
            ))}
          </select>
        {errors.lead_id && <p className="text-xs text-red-600 mt-1">{String(errors.lead_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="sequence_id" className="block text-sm font-medium text-gray-700">Sequence</label>
          <input type="number" {...register("sequence_id")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.sequence_id && <p className="text-xs text-red-600 mt-1">{String(errors.sequence_id.message)}</p>}
        </div>
        <div>
          <label htmlFor="step_number" className="block text-sm font-medium text-gray-700">Step Number</label>
          <input type="number" {...register("step_number")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.step_number && <p className="text-xs text-red-600 mt-1">{String(errors.step_number.message)}</p>}
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input type="text" {...register("subject")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.subject && <p className="text-xs text-red-600 mt-1">{String(errors.subject.message)}</p>}
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status *</label>
          <input type="text" {...register("status")} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        {errors.status && <p className="text-xs text-red-600 mt-1">{String(errors.status.message)}</p>}
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
