// Gig-specific Dashboard — vending_machine (VendFlow fleet command).
// Overrides the universal placeholder Dashboard. Reads GET /reports/dashboard
// (one server-side aggregate call) so the landing page never pulls raw rows.
import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from 'recharts';
import { Boxes, DollarSign, AlertTriangle, Wrench, Activity, ArrowUpRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

interface TrendPoint { date: string; revenue: number; }
interface RecentAlert {
  id: number;
  machine_id: number | null;
  alert_type: string | null;
  severity: string | null;
  message: string | null;
  created_at: string | null;
}
interface DashboardData {
  fleet: { total: number; online: number; offline: number; down: number; status_mix: Record<string, number>; };
  revenue: { total: number; transactions: number; trend: TrendPoint[]; };
  alerts: { open: number; by_severity: Record<string, number>; recent: RecentAlert[]; };
  operator: { name: string | null; monthly_volume: number } | null;
}

const BRAND = 'var(--color-brand, #4f46e5)';
const STATUS_COLORS: Record<string, string> = {
  active: '#16a34a', maintenance: '#f59e0b', offline: '#dc2626', unknown: '#9ca3af',
};
const SEV_PILL: Record<string, string> = {
  high: 'bg-red-100 text-red-700', medium: 'bg-amber-100 text-amber-800', low: 'bg-blue-100 text-blue-700',
};

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}
const fmtInt = (n: number): string => n.toLocaleString('en-US');

interface KpiProps {
  to: string;
  label: string;
  value: string;
  sub: string;
  icon: ReactNode;
  accent: string;
  alert?: boolean;
}
function Kpi({ to, label, value, sub, icon, accent, alert }: KpiProps) {
  return (
    <Link
      to={to}
      className={`group relative block rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        alert ? 'border-red-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl"
             style={{ background: `${accent}1a`, color: accent }}>
          {icon}
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-300 transition group-hover:text-gray-500" />
      </div>
      <div className="mt-4 text-3xl font-bold tracking-tight text-gray-900">{value}</div>
      <div className="mt-1 text-sm font-medium text-gray-500">{label}</div>
      <div className="mt-2 text-xs text-gray-400">{sub}</div>
    </Link>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/reports/dashboard').then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner fullPage />;
  if (isError || !data) return <div className="p-6 text-red-600">Failed to load the dashboard.</div>;

  const { fleet, revenue, alerts, operator } = data;
  const statusData = Object.entries(fleet.status_mix).map(([name, value]) => ({ name, value }));
  const avgDay = revenue.trend.length ? revenue.total / revenue.trend.length : 0;
  const highOpen = alerts.by_severity.high ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Command</h1>
          <p className="mt-1 text-sm text-gray-500">
            {operator?.name ?? 'Fleet'} · {fmtInt(fleet.total)} ice machines across West Texas
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          Live · 30-day window
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi to="/machine-map" label="Machines online"
             value={`${fmtInt(fleet.online)}/${fmtInt(fleet.total)}`}
             sub={`${fmtInt(fleet.offline)} offline right now`} accent="#16a34a"
             icon={<Boxes className="h-5 w-5" />} />
        <Kpi to="/revenue-report" label="Revenue (30 days)" value={fmtMoney(revenue.total)}
             sub={`${fmtMoney(avgDay)}/day · ${fmtInt(revenue.transactions)} vends`} accent="#4f46e5"
             icon={<DollarSign className="h-5 w-5" />} />
        <Kpi to="/alerts" label="Open alerts" value={fmtInt(alerts.open)}
             sub={`${fmtInt(highOpen)} high severity`} accent="#dc2626" alert={highOpen > 0}
             icon={<AlertTriangle className="h-5 w-5" />} />
        <Kpi to="/service-visits" label="Needs service" value={fmtInt(fleet.down)}
             sub="maintenance + offline units" accent="#f59e0b"
             icon={<Wrench className="h-5 w-5" />} />
      </div>

      {/* Revenue trend */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Daily revenue</h2>
            <p className="text-xs text-gray-400">Fleet-wide ice &amp; water sales, last 30 days</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
            <Activity className="h-4 w-4" style={{ color: BRAND }} /> {fmtMoney(revenue.total)} total
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenue.trend} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tickFormatter={(d) => format(parseISO(String(d)), 'MMM d')}
                     tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} minTickGap={24} />
              <YAxis tickFormatter={(v) => fmtMoney(Number(v))} tick={{ fontSize: 12, fill: '#94a3b8' }}
                     axisLine={false} tickLine={false} width={56} />
              <Tooltip
                formatter={(v) => [fmtMoney(Number(v)), 'Revenue']}
                labelFormatter={(d) => format(parseISO(String(d)), 'EEE, MMM d')}
                contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 13 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fleet status + open alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Status donut */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Fleet status</h2>
          <div className="flex items-center gap-4">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2}>
                    {statusData.map((s) => (
                      <Cell key={s.name} fill={STATUS_COLORS[s.name] ?? '#9ca3af'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${fmtInt(Number(v))} machines`, String(n)]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 text-sm">
              {statusData.map((s) => (
                <li key={s.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[s.name] ?? '#9ca3af' }} />
                  <span className="capitalize text-gray-600">{s.name}</span>
                  <span className="ml-auto font-semibold text-gray-900">{fmtInt(s.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Open alerts */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Open alerts</h2>
            <Link to="/alerts" className="text-sm font-medium" style={{ color: BRAND }}>View all →</Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {alerts.recent.length === 0 && (
              <li className="py-6 text-center text-sm text-gray-400">No open alerts — fleet healthy.</li>
            )}
            {alerts.recent.map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEV_PILL[a.severity ?? 'medium'] ?? 'bg-gray-100 text-gray-600'}`}>
                  {a.severity ?? 'medium'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{a.message ?? a.alert_type ?? 'Alert'}</p>
                  <p className="text-xs text-gray-400">
                    Machine #{a.machine_id ?? '—'}
                    {a.created_at ? ` · ${format(parseISO(a.created_at), 'MMM d, h:mm a')}` : ''}
                  </p>
                </div>
                <Link to="/alerts"
                      className="shrink-0 rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50">
                  Dispatch
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
