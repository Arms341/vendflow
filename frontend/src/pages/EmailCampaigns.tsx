// JARVIS App — EmailCampaigns (CONTRACT-FIRST wizard archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_wizard_page).
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createEmailSequences, createEmailSequencesActivate } from '@/lib/apiClient';
import type { EmailSequenceCreate, EmailSequenceResponse } from '@/types/api';

type FieldKind = 'string' | 'integer' | 'number' | 'boolean' | 'enum';
type FieldSpec = {
  name: string;
  label: string;
  kind: FieldKind;
  required: boolean;
  options?: string[];
};
type StepSpec = { title: string; fields: FieldSpec[] };

const STEPS: StepSpec[] = [
  {
    title: "Required",
    fields: [
      { name: "name", label: "Name", kind: "string", required: true },
    ],
  },
  {
    title: "Details",
    fields: [
      { name: "operator_id", label: "Operator Id", kind: "integer", required: false },
      { name: "trigger_status", label: "Trigger Status", kind: "string", required: false },
      { name: "steps_json", label: "Steps Json", kind: "string", required: false },
      { name: "is_active", label: "Is Active", kind: "boolean", required: false },
    ],
  },
];

const ALL_FIELDS: FieldSpec[] = STEPS.reduce<FieldSpec[]>((acc, s) => acc.concat(s.fields), []);

function coerce(spec: FieldSpec, raw: string): unknown {
  if (raw === '') return undefined;
  if (spec.kind === 'integer') {
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : undefined;
  }
  if (spec.kind === 'number') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  }
  if (spec.kind === 'boolean') return raw === 'true';
  return raw;
}

export default function EmailCampaigns() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<EmailSequenceResponse | null>(null);
  const [note, setNote] = useState<string>('');

  const reviewIndex = STEPS.length;
  const doneIndex = STEPS.length + 1;

  const setField = (name: string, raw: string) =>
    setValues((prev) => ({ ...prev, [name]: raw }));

  const missing = (s: StepSpec): string[] =>
    s.fields.filter((f: any) => f.required && !(values[f.name] ?? '').trim()).map((f: any) => f.label);

  const buildPayload = (): EmailSequenceCreate => {
    const out: Record<string, unknown> = {};
    for (const f of ALL_FIELDS) {
      const v = coerce(f, values[f.name] ?? '');
      if (v !== undefined) out[f.name] = v;
    }
    return out as unknown as EmailSequenceCreate;
  };

  const createMutation = useMutation({
    mutationFn: () => createEmailSequences(buildPayload()),
    onSuccess: (row: EmailSequenceResponse) => {
      setCreated(row);
      setNote('');
      setStep(doneIndex);
      queryClient.invalidateQueries({ queryKey: ["email_sequences"] });
    },
    onError: () => setNote('Could not save. Check the required fields and try again.'),
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => createEmailSequencesActivate(id),
    onSuccess: () => {
      setNote('Activate complete.');
      queryClient.invalidateQueries({ queryKey: ["email_sequences"] });
    },
    onError: () => setNote('Activate failed.'),
  });
  const current = step < STEPS.length ? STEPS[step] : null;
  const blocked = current ? missing(current) : [];

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">Email Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">{"Email sequence manager: create drip campaigns, set trigger conditions, view send logs and open rates"}</p>
      <ol className="flex flex-wrap gap-2 my-4 text-sm">
        {STEPS.map((s: any, i: any) => (
          <li
            key={s.title}
            className={
              'px-3 py-1 rounded-full border ' +
              (i === step
                ? 'bg-blue-600 text-white border-blue-600'
                : i < step
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-gray-50 text-gray-500 border-gray-200')
            }
          >
            {i + 1}. {s.title}
          </li>
        ))}
        <li
          className={
            'px-3 py-1 rounded-full border ' +
            (step >= reviewIndex
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-50 text-gray-500 border-gray-200')
          }
        >
          {STEPS.length + 1}. Review
        </li>
      </ol>

      {note && <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">{note}</div>}

      {current && (
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="font-semibold mb-3">{current.title}</h2>
          <div className="grid grid-cols-1 gap-4">
            {current.fields.map((f: any) => (
              <label key={f.name} className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  {f.label}
                  {f.required && <span className="text-red-600"> *</span>}
                </span>
                {f.kind === 'enum' ? (
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={values[f.name] ?? ''}
                    onChange={(e) => setField(f.name, e.target.value)}
                  >
                    <option value="">Select...</option>
                    {(f.options ?? []).map((o: any) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : f.kind === 'boolean' ? (
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={values[f.name] ?? ''}
                    onChange={(e) => setField(f.name, e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    type={f.kind === 'integer' || f.kind === 'number' ? 'number' : 'text'}
                    value={values[f.name] ?? ''}
                    onChange={(e) => setField(f.name, e.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {step === reviewIndex && (
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="font-semibold mb-3">Review</h2>
          <dl className="grid grid-cols-1 gap-2">
            {ALL_FIELDS.map((f: any) => (
              <div key={f.name} className="flex justify-between border-b border-gray-100 py-1">
                <dt className="text-sm text-gray-500">{f.label}</dt>
                <dd className="text-sm text-gray-900">{values[f.name] ?? ''}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {step === doneIndex && (
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="font-semibold mb-3">Created</h2>
          <p className="text-sm text-gray-600 mb-4">
            Record #{String(created?.id ?? '')} saved. Finish by running the action below.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
              disabled={!created?.id || activateMutation.isPending}
              onClick={() => { if (created?.id) activateMutation.mutate(Number(created.id)); }}
            >
              Activate
            </button>
            <Link to="/email-sequences" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">
              Back to list
            </Link>
          </div>
        </div>
      )}

      {step !== doneIndex && (
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </button>
          {step < reviewIndex ? (
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
              disabled={blocked.length > 0}
              title={blocked.length > 0 ? 'Required: ' + blocked.join(', ') : undefined}
              onClick={() => setStep((s) => s + 1)}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
              disabled={createMutation.isPending}
              onClick={() => createMutation.mutate()}
            >
              {createMutation.isPending ? 'Saving...' : 'Create'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
