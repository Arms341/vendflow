// JARVIS App — ProposalBuilder (CONTRACT-FIRST wizard archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_wizard_page).
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createProposals, createProposalsSend } from '@/lib/apiClient';
import type { ProposalCreate, ProposalResponse } from '@/types/api';

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
      { name: "title", label: "Title", kind: "string", required: true },
      { name: "status", label: "Status", kind: "string", required: true },
    ],
  },
  {
    title: "Details 1",
    fields: [
      { name: "lead_id", label: "Lead Id", kind: "integer", required: false },
      { name: "operator_id", label: "Operator Id", kind: "integer", required: false },
      { name: "description", label: "Description", kind: "string", required: false },
      { name: "machine_type", label: "Machine Type", kind: "string", required: false },
      { name: "machine_count", label: "Machine Count", kind: "integer", required: false },
      { name: "monthly_revenue_estimate", label: "Monthly Revenue Estimate", kind: "number", required: false },
    ],
  },
  {
    title: "Details 2",
    fields: [
      { name: "commission_split", label: "Commission Split", kind: "number", required: false },
      { name: "placement_fee", label: "Placement Fee", kind: "number", required: false },
      { name: "contract_term_months", label: "Contract Term Months", kind: "integer", required: false },
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

export default function ProposalBuilder() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<ProposalResponse | null>(null);
  const [note, setNote] = useState<string>('');

  const reviewIndex = STEPS.length;
  const doneIndex = STEPS.length + 1;

  const setField = (name: string, raw: string) =>
    setValues((prev) => ({ ...prev, [name]: raw }));

  const missing = (s: StepSpec): string[] =>
    s.fields.filter((f: any) => f.required && !(values[f.name] ?? '').trim()).map((f: any) => f.label);

  const buildPayload = (): ProposalCreate => {
    const out: Record<string, unknown> = {};
    for (const f of ALL_FIELDS) {
      const v = coerce(f, values[f.name] ?? '');
      if (v !== undefined) out[f.name] = v;
    }
    return out as unknown as ProposalCreate;
  };

  const createMutation = useMutation({
    mutationFn: () => createProposals(buildPayload()),
    onSuccess: (row: ProposalResponse) => {
      setCreated(row);
      setNote('');
      setStep(doneIndex);
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
    onError: () => setNote('Could not save. Check the required fields and try again.'),
  });

  const sendMutation = useMutation({
    mutationFn: (id: number) => createProposalsSend(id),
    onSuccess: () => {
      setNote('Send complete.');
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
    onError: () => setNote('Send failed.'),
  });
  const current = step < STEPS.length ? STEPS[step] : null;
  const blocked = current ? missing(current) : [];

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">Proposal Builder</h1>
          <p className="mt-1 text-sm text-gray-500">{"Proposal creation and preview screen: configure machine count, revenue estimates, commission split, and send/sign flow"}</p>
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
              disabled={!created?.id || sendMutation.isPending}
              onClick={() => { if (created?.id) sendMutation.mutate(Number(created.id)); }}
            >
              Send
            </button>
            <Link to="/proposals" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">
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
