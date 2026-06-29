// VendFlow — Alerting & Dispatch console (gig-specific hero page).
// Replaces the universal id/name placeholder table.
// Reads GET /alerts/, joins machine + location, and lets the operator
// dispatch (acknowledge) and resolve alerts inline against PUT /alerts/{id}.
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, Bell, CheckCircle, Wrench, MapPin, Filter, RefreshCw,
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { api } from '@/lib/api';
import type { Alert, Machine, Location } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

const SEV_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };
const SEV_PILL: Record<string, string> = {
  high: 'bg-red-100 text-red-700 ring-red-200',
  medium: 'bg-amber-100 text-amber-800 ring-amber-200',
  low: 'bg-blue-100 text-blue-700 ring-blue-200',
};
const SEV_DOT: Record<string, string> = {
  high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-blue-500',
};

type SevFilter = 'all' | 'high' | 'medium' | 'low';
type StatusFilter = 'open' | 'all';

function isOpen(a: Alert): boolean {
  return !a.is_acknowledged && !a.resolved_at;
}
function ago(ts: string | null | undefined): string {
  if (!ts) return '—';
  try {
    return `${formatDistanceToNow(parseISO(ts))} ago`;
  } catch {
    return '—';
  }
}

interface StatProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  active?: boolean;
}
function Stat({ label, value, icon, accent, active }: StatProps) {
  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm ${active ? 'border-red-200' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: `${accent}1a`, color: accent }}>{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{value.toLocaleString('en-US')}</div>
    </div>
  );
}

export default function AlertsPage() {
  const qc = useQueryClient();
  const [sev, setSev] = useState<SevFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('open');
  const [busyId, setBusyId] = useState<number | null>(null);

  const alertsQ = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: () => api.get<Alert[]>('/alerts/', { params: { limit: 1000 } }).then((r) => r.data),
  });
  const machinesQ = useQuery<Machine[]>({
    queryKey: ['machines', 'all'],
    queryFn: () => api.get<Machine[]>('/machines/', { params: { limit: 1000 } }).then((r) => r.data),
  });
  const locationsQ = useQuery<Location[]>({
    queryKey: ['locations', 'all'],
    queryFn: () => api.get<Location[]>('/locations/', { params: { limit: 1000 } }).then((r) => r.data),
  });

  const machineMap = useMemo(() => {
    const m = new Map<number, Machine>();
    (machinesQ.data ?? []).forEach((x) => m.set(x.id, x));
    return m;
  }, [machinesQ.data]);
  const locationMap = useMemo(() => {
    const m = new Map<number, Location>();
    (locationsQ.data ?? []).forEach((x) => m.set(x.id, x));
    return m;
  }, [locationsQ.data]);

  const mutate = useMutation({
    mutationFn: (vars: { id: number; body: Record<string, unknown> }) =>
      api.put(`/alerts/${vars.id}`, vars.body),
    onMutate: (vars) => setBusyId(vars.id),
    onSettled: () => {
      setBusyId(null);
      qc.invalidateQueries({ queryKey: ['alerts'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const dispatch = (a: Alert) =>
    mutate.mutate({ id: a.id, body: { is_acknowledged: true, acknowledged_at: new Date().toISOString() } });
  const resolve = (a: Alert) =>
    mutate.mutate({ id: a.id, body: { resolved_at: new Date().toISOString() } });

  const all = alertsQ.data ?? [];
  const counts = useMemo(() => {
    const open = all.filter(isOpen);
    return {
      open: open.length,
      high: open.filter((a) => (a.severity ?? '') === 'high').length,
      acknowledged: all.filter((a) => a.is_acknowledged && !a.resolved_at).length,
      resolved: all.filter((a) => !!a.resolved_at).length,
    };
  }, [all]);

  const visible = useMemo(() => {
    let list = status === 'open' ? all.filter(isOpen) : all.slice();
    if (sev !== 'all') list = list.filter((a) => (a.severity ?? 'medium') === sev);
    return list.sort((x, y) => {
      const sx = SEV_ORDER[x.severity ?? 'medium'] ?? 3;
      const sy = SEV_ORDER[y.severity ?? 'medium'] ?? 3;
      if (sx !== sy) return sx - sy;
      const tx = x.created_at ? Date.parse(x.created_at) : 0;
      const ty = y.created_at ? Date.parse(y.created_at) : 0;
      return ty - tx;
    });
  }, [all, sev, status]);

  if (alertsQ.isLoading) return <LoadingSpinner fullPage />;
  if (alertsQ.isError) return <div className="p-6 text-red-600">Failed to load alerts.</div>;

  const machineLabel = (mid: number | null | undefined): { title: string; sub: string } => {
    if (mid == null) return { title: 'Unassigned', sub: '' };
    const m = machineMap.get(mid);
    if (!m) return { title: `Machine #${mid}`, sub: '' };
    const loc = m.location_id != null ? locationMap.get(m.location_id) : undefined;
    return {
      title: m.serial_number || m.name || `Machine #${mid}`,
      sub: loc ? `${loc.name}${loc.city ? ` · ${loc.city}` : ''}` : '',
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerting &amp; Dispatch</h1>
          <p className="mt-1 text-sm text-gray-500">
            Live fault monitoring across the fleet — dispatch a tech in one click.
          </p>
        </div>
        <button
          onClick={() => { alertsQ.refetch(); }}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw size={14} className={alertsQ.isFetching ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Open alerts" value={counts.open} accent="#dc2626" active={counts.open > 0}
              icon={<Bell size={16} />} />
        <Stat label="High severity" value={counts.high} accent="#dc2626"
              icon={<AlertTriangle size={16} />} />
        <Stat label="Dispatched" value={counts.acknowledged} accent="#f59e0b"
              icon={<Wrench size={16} />} />
        <Stat label="Resolved" value={counts.resolved} accent="#16a34a"
              icon={<CheckCircle size={16} />} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
          <Filter size={14} /> Filter
        </span>
        <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
          {(['open', 'all'] as StatusFilter[]).map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={`rounded-md px-3 py-1 text-sm font-medium capitalize transition ${
                status === s ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'}`}>
              {s === 'open' ? 'Open only' : 'All'}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
          {(['all', 'high', 'medium', 'low'] as SevFilter[]).map((s) => (
            <button key={s} onClick={() => setSev(s)}
              className={`rounded-md px-3 py-1 text-sm font-medium capitalize transition ${
                sev === s ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'}`}>
              {s}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-gray-400">{visible.length} shown</span>
      </div>

      {/* Alert list */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <CheckCircle size={32} className="text-green-500" />
            <p className="text-sm font-medium text-gray-600">No alerts match — fleet is healthy.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visible.map((a) => {
              const lbl = machineLabel(a.machine_id);
              const severity = a.severity ?? 'medium';
              const open = isOpen(a);
              const acked = a.is_acknowledged && !a.resolved_at;
              const resolved = !!a.resolved_at;
              return (
                <li key={a.id} className={`flex flex-wrap items-center gap-4 p-4 ${resolved ? 'opacity-60' : ''}`}>
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${SEV_DOT[severity] ?? 'bg-gray-400'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ring-1 ${SEV_PILL[severity] ?? 'bg-gray-100 text-gray-600 ring-gray-200'}`}>
                        {severity}
                      </span>
                      <span className="truncate text-sm font-semibold text-gray-900">
                        {a.message || a.alert_type || 'Alert'}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} /> {lbl.title}{lbl.sub ? ` — ${lbl.sub}` : ''}
                      </span>
                      <span>·</span>
                      <span>{a.alert_type ?? 'fault'}</span>
                      <span>·</span>
                      <span>raised {ago(a.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {resolved && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                        <CheckCircle size={14} /> Resolved
                      </span>
                    )}
                    {acked && (
                      <>
                        <span className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700">Dispatched</span>
                        <button onClick={() => resolve(a)} disabled={busyId === a.id}
                          className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-50">
                          {busyId === a.id ? '…' : 'Mark resolved'}
                        </button>
                      </>
                    )}
                    {open && (
                      <button onClick={() => dispatch(a)} disabled={busyId === a.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--color-brand)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50">
                        <Wrench size={14} /> {busyId === a.id ? 'Dispatching…' : 'Dispatch tech'}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-center text-xs text-gray-400">
        Need the full fleet view? <Link to="/machine-map" className="font-medium text-[var(--color-brand)]">Open the fleet map →</Link>
      </p>
    </div>
  );
}
