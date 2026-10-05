// JARVIS App — WebsiteBuilder (CONTRACT-FIRST settings archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_settings_page).
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listOperatorWebsites, updateOperatorWebsites, createOperatorWebsitesPublish } from '@/lib/apiClient';
import type { OperatorWebsiteResponse, OperatorWebsiteUpdate } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';

type Current = OperatorWebsiteResponse;
type FieldKind = 'string' | 'number' | 'integer' | 'boolean' | 'enum';
type Field = { key: string; label: string; kind: FieldKind; required: boolean; options: string[] };
type Draft = Record<string, string>;

const FIELDS: Field[] = [
  { key: "operator_id", label: "Operator Id", kind: "integer", required: false, options: [] },
  { key: "domain", label: "Domain", kind: "string", required: false, options: [] },
  { key: "subdomain", label: "Subdomain", kind: "string", required: false, options: [] },
  { key: "company_name", label: "Company Name", kind: "string", required: false, options: [] },
  { key: "tagline", label: "Tagline", kind: "string", required: false, options: [] },
  { key: "logo_url", label: "Logo Url", kind: "string", required: false, options: [] },
  { key: "primary_color", label: "Primary Color", kind: "string", required: false, options: [] },
  { key: "phone", label: "Phone", kind: "string", required: false, options: [] },
  { key: "email", label: "Email", kind: "string", required: false, options: [] },
  { key: "about_text", label: "About Text", kind: "string", required: false, options: [] },
  { key: "services_json", label: "Services Json", kind: "string", required: false, options: [] },
  { key: "chatbot_enabled", label: "Chatbot Enabled", kind: "boolean", required: false, options: [] },
  { key: "chatbot_greeting", label: "Chatbot Greeting", kind: "string", required: false, options: [] },
  { key: "is_published", label: "Is Published", kind: "boolean", required: false, options: [] },
  { key: "template_id", label: "Template Id", kind: "string", required: false, options: [] },
];

const DEFAULTS: Draft = {
  "operator_id": "",
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
  "chatbot_enabled": "false",
  "chatbot_greeting": "",
  "is_published": "false",
  "template_id": "",
};

export default function WebsiteBuilder() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Draft>(DEFAULTS);

  const { data, isLoading, error } = useQuery({
    queryKey: ["operator_websites"],
    queryFn: () => listOperatorWebsites(),
  });

  // The configuration row: lowest id in the entity's own list response.
  const current = useMemo(() => {
    const rows: Current[] = data ?? [];
    if (rows.length === 0) return null;
    return rows.reduce((a: Current, b: Current) => (Number(b.id) < Number(a.id) ? b : a));
  }, [data]);

  useEffect(() => {
    if (!current) return;
    setDraft({
      ...DEFAULTS,
      "operator_id": String(current.operator_id ?? ''),
      "domain": String(current.domain ?? ''),
      "subdomain": String(current.subdomain ?? ''),
      "company_name": String(current.company_name ?? ''),
      "tagline": String(current.tagline ?? ''),
      "logo_url": String(current.logo_url ?? ''),
      "primary_color": String(current.primary_color ?? ''),
      "phone": String(current.phone ?? ''),
      "email": String(current.email ?? ''),
      "about_text": String(current.about_text ?? ''),
      "services_json": String(current.services_json ?? ''),
      "chatbot_enabled": current.chatbot_enabled === true ? 'true' : 'false',
      "chatbot_greeting": String(current.chatbot_greeting ?? ''),
      "is_published": current.is_published === true ? 'true' : 'false',
      "template_id": String(current.template_id ?? ''),
    });
  }, [current]);

  const save = useMutation({
    mutationFn: (payload: OperatorWebsiteUpdate) => updateOperatorWebsites(Number(current?.id ?? 0), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operator_websites"] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (key: number) => createOperatorWebsitesPublish(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operator_websites"] });
    },
  });

  const setField = (key: string, value: string) => {
    if (save.isSuccess || save.isError) save.reset();
    setDraft((d: Draft) => ({ ...d, [key]: value }));
  };

  const missingRequired = FIELDS.some(
    (f: Field) => f.required && (draft[f.key] ?? '') === '',
  );

  const onSave = () => {
    const payload: Record<string, unknown> = {};
    for (const f of FIELDS) {
      const raw = draft[f.key] ?? '';
      if (raw === '') continue;
      if (f.kind === 'number' || f.kind === 'integer') payload[f.key] = Number(raw);
      else if (f.kind === 'boolean') payload[f.key] = raw === 'true';
      else payload[f.key] = raw;
    }
    save.mutate(payload as unknown as OperatorWebsiteUpdate);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Website Builder</div>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Website Builder</h1>
          <p className="mt-1 text-sm text-gray-500">{"Operator website builder: edit company info, choose template, configure chatbot, and publish branded site"}</p>
      </div>
      <div className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        {current === null ? (
          <p className="text-sm text-gray-500">No record to configure yet.</p>
        ) : null}
        {FIELDS.map((f: Field) => (
          <div key={f.key}>
            <label htmlFor={f.key} className="block text-sm font-medium text-gray-700">
              {f.label}{f.required ? ' *' : ''}
            </label>
            {f.kind === 'boolean' ? (
              <input
                id={f.key}
                type="checkbox"
                checked={(draft[f.key] ?? '') === 'true'}
                onChange={(e) => setField(f.key, e.target.checked ? 'true' : 'false')}
                className="mt-1 h-4 w-4"
              />
            ) : f.kind === 'enum' ? (
              <select
                id={f.key}
                value={draft[f.key] ?? ''}
                onChange={(e) => setField(f.key, e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select…</option>
                {f.options.map((o: string) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                id={f.key}
                type={f.kind === 'number' || f.kind === 'integer' ? 'number' : 'text'}
                value={draft[f.key] ?? ''}
                onChange={(e) => setField(f.key, e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            )}
          </div>
        ))}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={save.isPending || missingRequired || current === null}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
          >
            {save.isPending ? 'Saving…' : 'Save'}
          </button>
          {save.isSuccess ? <span className="text-sm text-green-700">Saved.</span> : null}
          {save.isError ? (
            <span className="text-sm text-red-600">Could not save. Please try again.</span>
          ) : null}
          {missingRequired ? (
            <span className="text-sm text-gray-500">Fill the required fields to save.</span>
          ) : null}
        </div>
        <div className="pt-4 mt-2 border-t border-gray-100 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => { if (current) publishMutation.mutate(Number(current.id)); }}
            disabled={!Number.isFinite(Number(current?.id)) || publishMutation.isPending}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
          >
            {publishMutation.isPending ? 'Publish…' : 'Publish'}
          </button>
          {publishMutation.isSuccess ? (
            <span className="text-sm text-green-700">Publish complete.</span>
          ) : null}
          {publishMutation.isError ? (
            <span className="text-sm text-red-600">Publish failed.</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
