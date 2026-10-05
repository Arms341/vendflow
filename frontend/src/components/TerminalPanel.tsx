// VendFlow — the payment terminal, from HQ  v1.0.0  (S204)
//
// WHY THIS EXISTS: the first reader goes into a machine hours away, installed by someone who is
// not expected to know MDB. This panel is the Settings and Status screens of the terminal, on
// the Machine page: what the terminal last said about itself, and the settings HQ may change.
//
// The server owns the rules. GET /terminal_configs/{terminal_id} returns `spec` — every setting
// HQ may send, with its type and limits — and this form is drawn from it, so the page cannot
// offer a field the server would refuse. The terminal (VendFlowPay 0.3.5+) checks in every 30 s,
// applies a new revision once, and reports back anything it refused.
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { fmtDateTime } from '@/lib/format';

type SpecItem = {
  key: string; label: string; type: 'int' | 'bool' | 'decimal' | 'str'; group: string;
  choices?: number[]; min?: number | string; max?: number | string; help?: string;
};
type Scalar = string | number | boolean;
type TerminalStatus = {
  rejected?: string[]; state?: Record<string, string>; config?: Record<string, Scalar>;
  events?: string[]; bus?: string[]; sent_at?: string;
};
type TerminalView = {
  terminal_id: string; settings: Record<string, Scalar>; settings_rev: number;
  applied_rev: number | null; app_version: string | null; status: TerminalStatus | null;
  status_at: string | null; spec: SpecItem[];
};

const STALE_MS = 2 * 60 * 1000;   // four missed check-ins
const STATE_ROWS: [string, string][] = [
  ['mdb', 'MDB bus'], ['session', 'Session'], ['vmc', 'Machine controller'],
  ['status', 'Status'], ['provider', 'Payment'], ['remote', 'HQ settings'],
];

function ago(iso: string | null): { text: string; stale: boolean } {
  if (!iso) return { text: 'never', stale: true };
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms)) return { text: 'unknown', stale: true };
  const s = Math.max(0, Math.round(ms / 1000));
  const text = s < 90 ? `${s} s ago` : s < 5400 ? `${Math.round(s / 60)} min ago` : `${Math.round(s / 3600)} h ago`;
  return { text, stale: ms > STALE_MS };
}

function errText(err: unknown): string {
  const e = err as { response?: { data?: { detail?: unknown } }; message?: string };
  const d = e?.response?.data?.detail;
  return typeof d === 'string' ? d : (e?.message ?? 'Something went wrong');
}

export default function TerminalPanel({ terminalId }: { terminalId: string }) {
  const queryClient = useQueryClient();
  const key = ['terminal_config', terminalId];
  const view = useQuery<TerminalView>({
    queryKey: key,
    queryFn: async () => (await api.get(`/terminal_configs/${encodeURIComponent(terminalId)}`)).data,
    refetchInterval: 15000,
  });
  // What the operator has changed on this page and not sent yet. key -> text as typed.
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: async (settings: Record<string, Scalar>) =>
      (await api.put(`/terminal_configs/${encodeURIComponent(terminalId)}`, { settings })).data as TerminalView,
    onSuccess: (data) => { setEdits({}); setFormError(null); queryClient.setQueryData(key, data); },
    onError: (err) => setFormError(errText(err)),
  });

  if (view.isLoading) return <div className="mt-6 text-sm text-gray-500">Loading terminal…</div>;
  if (view.isError || !view.data) {
    return <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">Terminal settings could not be loaded.</div>;
  }
  const v = view.data;
  const saved = v.settings ?? {};
  const onDevice = v.status?.config ?? {};
  const seen = ago(v.status_at);
  const waiting = v.settings_rev > 0 && v.applied_rev !== v.settings_rev;
  const rejected = v.status?.rejected ?? [];
  const groups = Array.from(new Set(v.spec.map((s) => s.group)));

  const shown = (s: SpecItem): string => {
    if (s.key in edits) return edits[s.key];
    const val = s.key in saved ? saved[s.key] : onDevice[s.key];
    return val === undefined || val === null ? '' : String(val);
  };
  const parse = (s: SpecItem, text: string): Scalar | undefined => {
    const t = text.trim();
    if (t === '') return undefined;
    if (s.type === 'bool') return t === 'true';
    if (s.type === 'int') return /^-?\d+$/.test(t) ? Number(t) : t;   // a bad number is sent as typed; the server says why
    return t;
  };
  const send = (extra: Record<string, string>) => {
    const out: Record<string, Scalar> = { ...saved };
    for (const s of v.spec) {
      if (!(s.key in extra)) continue;
      const val = parse(s, extra[s.key]);
      if (val === undefined) delete out[s.key]; else out[s.key] = val;
    }
    save.mutate(out);
  };
  const dirty = Object.keys(edits).length > 0;
  const field = 'min-h-[40px] w-full rounded-md border border-gray-300 px-2 text-sm text-gray-900';

  return (
    <section className="mt-6 space-y-4" aria-label="Payment terminal">
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 md:px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-900">Payment terminal</h2>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${seen.stale ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
            {v.status_at ? `Checked in ${seen.text}` : 'Has not checked in'}
          </span>
        </div>
        <div className="px-4 md:px-6 py-3 text-sm text-gray-700 space-y-1">
          {!v.status_at ? (
            <p>This terminal has not reported to HQ yet. It needs VendFlowPay 0.3.5 or later, powered on and online.</p>
          ) : (
            <>
              <p>
                <span className="text-gray-500">Last check-in:</span> {fmtDateTime(v.status_at)}
                {v.app_version ? <> · <span className="text-gray-500">App</span> {v.app_version}</> : null}
              </p>
              {seen.stale ? <p className="text-amber-800">No check-in for {seen.text.replace(' ago', '')}. A running terminal checks in every 30 seconds, so it is off, offline, or stuck.</p> : null}
            </>
          )}
          <p>
            <span className="text-gray-500">Settings from HQ:</span>{' '}
            {v.settings_rev === 0 ? 'none sent' : waiting
              ? `revision ${v.settings_rev} saved, waiting for the terminal to pick it up`
              : `revision ${v.settings_rev} applied`}
          </p>
          {rejected.length > 0 ? (
            <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-red-800">
              <div className="font-medium">The terminal refused {rejected.length === 1 ? 'one setting' : `${rejected.length} settings`}:</div>
              <ul className="list-disc pl-5">{rejected.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
          ) : null}
        </div>
        {v.status?.state ? (
          <dl className="border-t border-gray-100 divide-y divide-gray-100">
            {STATE_ROWS.filter(([k]) => v.status?.state?.[k]).map(([k, label]) => (
              <div key={k} className="grid grid-cols-5 md:grid-cols-3 gap-3 md:gap-4 px-4 md:px-6 py-2">
                <dt className="col-span-2 md:col-span-1 text-sm font-medium text-gray-500">{label}</dt>
                <dd className="col-span-3 md:col-span-2 min-w-0 break-words text-sm text-gray-900">{v.status?.state?.[k]}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {(v.status?.events?.length ?? 0) > 0 ? (
          <details className="border-t border-gray-100 px-4 md:px-6 py-3" open>
            <summary className="cursor-pointer text-sm font-medium text-gray-700">What the terminal has been doing ({v.status?.events?.length} lines, newest last)</summary>
            <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md bg-gray-900 p-3 text-xs leading-relaxed text-gray-100">{(v.status?.events ?? []).join('\n')}</pre>
          </details>
        ) : null}
        {(v.status?.bus?.length ?? 0) > 0 ? (
          <details className="border-t border-gray-100 px-4 md:px-6 py-3">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">MDB library, last {v.status?.bus?.length} lines</summary>
            <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md bg-gray-900 p-3 text-xs leading-relaxed text-gray-100">{(v.status?.bus ?? []).join('\n')}</pre>
          </details>
        ) : null}
      </div>

      <form
        className="rounded-xl border border-gray-200 bg-white"
        onSubmit={(e) => { e.preventDefault(); if (dirty) send(edits); }}
      >
        <div className="border-b border-gray-100 px-4 md:px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-900">Terminal settings</h2>
          <p className="text-sm text-gray-500">Each box shows the value on the terminal. Change what you need and send it; the terminal applies it at its next check-in and restarts its MDB connection. It never applies a change while a sale is in progress.</p>
        </div>
        {groups.map((g) => (
          <fieldset key={g} className="border-b border-gray-100 px-4 md:px-6 py-3">
            <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500">{g}</legend>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {v.spec.filter((s) => s.group === g).map((s) => {
                const id = `ts-${s.key}`;
                const val = shown(s);
                const dev = onDevice[s.key];
                const differs = dev !== undefined && val !== '' && String(dev) !== val;
                const set = (text: string) => setEdits((prev) => ({ ...prev, [s.key]: text }));
                return (
                  <div key={s.key}>
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{s.label}</label>
                    {s.type === 'bool' ? (
                      <select id={id} className={field} value={val} onChange={(e) => set(e.target.value)}>
                        <option value="">Leave as is</option><option value="true">On</option><option value="false">Off</option>
                      </select>
                    ) : s.choices ? (
                      <select id={id} className={field} value={val} onChange={(e) => set(e.target.value)}>
                        <option value="">Leave as is</option>
                        {s.choices.map((c) => <option key={c} value={String(c)}>{c}</option>)}
                      </select>
                    ) : (
                      <input id={id} className={field} value={val} inputMode={s.type === 'str' ? 'text' : 'decimal'}
                        onChange={(e) => set(e.target.value)} />
                    )}
                    <p className="mt-0.5 text-xs text-gray-500">
                      {s.min !== undefined && !s.choices ? `${s.min} to ${s.max}. ` : ''}{s.help ?? ''}
                      {differs ? <span className="text-amber-700"> On the terminal now: {String(dev)}.</span> : null}
                    </p>
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
        <div className="flex flex-wrap items-center gap-2 px-4 md:px-6 py-3">
          <button type="submit" disabled={!dirty || save.isPending}
            className="min-h-[40px] rounded-md bg-blue-600 px-4 text-sm font-medium text-white disabled:opacity-50">
            {save.isPending ? 'Sending…' : 'Send to terminal'}
          </button>
          <button type="button" disabled={save.isPending} onClick={() => send({})}
            className="min-h-[40px] rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 disabled:opacity-50"
            title="Sends the saved settings again as a new revision, which makes the terminal restart its MDB connection">
            Restart MDB connection
          </button>
          {dirty ? <button type="button" onClick={() => { setEdits({}); setFormError(null); }} className="min-h-[40px] px-2 text-sm text-gray-600 underline">Undo changes</button> : null}
          {formError ? <span role="alert" className="text-sm text-red-700">{formError}</span> : null}
        </div>
      </form>
    </section>
  );
}
