// VendFlow — Operator Dashboard  v2.0.1  (S191; S194 stock_tracked)
// Was: 6 entity-count tiles + 3 bar charts of wholesale data that rendered as
// EMPTY AXES because those tables have no rows, and a "Total Revenue" that
// summed gross and ignored voids. [MEASURED S191]
//
// Now: the four numbers an operator actually opens this page for, one
// single-series revenue chart with a real empty state, and the recent
// transactions — a table, because six rows is not a chart.
// Builder home: Road 1 / B6.
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Box, Banknote, CreditCard, PackageX, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  listDailyReports, listMachines, listTransactions, listInventories,
} from '@/lib/apiClient';
import type {
  DailyReportResponse, MachineResponse, TransactionResponse, InventoryItemResponse,
} from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtCurrency, fmtValue } from '@/lib/format';
import { fetchAll } from '@/lib/paginate';

const BRAND_HUE = '#0074C8';
const LOW_STOCK_FRACTION = 0.25;

type Tone = 'neutral' | 'good' | 'warn';

function StatTile({ label, value, sub, icon: Icon, tone = 'neutral' }: {
  label: string; value: string; sub?: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  // Tone is state, never decoration: it only fires when the number means something.
  const chip =
    tone === 'warn' ? 'bg-amber-50 text-amber-600'
    : tone === 'good' ? 'bg-emerald-50 text-emerald-600'
    : 'bg-slate-100 text-slate-500';
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</div>
          <div className="text-xl xl:text-[26px] leading-tight font-bold text-gray-900 mt-1 tabular-nums truncate">{value}</div>
          {sub ? <div className="text-xs text-gray-400 mt-1">{sub}</div> : null}
        </div>
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${chip}`}>
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}

/** Status is state, not a series: reserved colors, always with the label. */
function StatusBadge({ status }: { status: string }) {
  const s = String(status || '').toLowerCase();
  const tone =
    s === 'approved' ? 'bg-green-50 text-green-700 ring-green-600/20'
    : s === 'voided' || s === 'refunded' ? 'bg-gray-100 text-gray-600 ring-gray-500/20'
    : s === 'declined' || s === 'failed' ? 'bg-red-50 text-red-700 ring-red-600/20'
    : 'bg-gray-100 text-gray-600 ring-gray-500/20';
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tone}`}>
      {fmtValue('payment_status', status)}
    </span>
  );
}

function EmptyPlot({ message }: { message: string }) {
  return (
    <div className="h-[220px] flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-gray-200">
      <div className="text-sm text-gray-500">{message}</div>
      <div className="text-xs text-gray-400 mt-1">It will appear here as soon as there is data.</div>
    </div>
  );
}

export default function Dashboard() {
  const dailyReports = useQuery<DailyReportResponse[]>({ queryKey: ['daily_reports'], queryFn: () => fetchAll((q) => listDailyReports(q)) });
  const machines = useQuery<MachineResponse[]>({ queryKey: ['machines'], queryFn: () => fetchAll((q) => listMachines(q)) });
  const transactions = useQuery<TransactionResponse[]>({ queryKey: ['transactions'], queryFn: () => fetchAll((q) => listTransactions(q)) });
  const inventories = useQuery<InventoryItemResponse[]>({ queryKey: ['inventories'], queryFn: () => fetchAll((q) => listInventories(q)) });

  if (dailyReports.isLoading || machines.isLoading || transactions.isLoading || inventories.isLoading) {
    return <LoadingSpinner />;
  }

  const reports = dailyReports.data ?? [];
  const machineRows = machines.data ?? [];
  const txRows = transactions.data ?? [];
  const invRows = inventories.data ?? [];

  // Net revenue: the daily reports are the ledger, and since webhooks v1.3.0 a
  // void backs its parent out of them. Summing them is summing NET.
  const netRevenue = reports.reduce((a, r) => a + Number(r.total_revenue ?? 0), 0);
  const onlineCount = machineRows.filter((m) => m.is_online).length;
  const settledCount = txRows.filter((t) => String(t.payment_status) === 'approved').length;
  const reversedCount = txRows.filter((t) => String(t.payment_status) === 'voided').length;
  const lowSlots = invRows.filter((i) => {
    // S194: a self-replenishing slot (ice maker, water line) is never "low" —
    // stock_tracked=false opts it out; undefined/null/true keep the old rule.
    if ((i as { stock_tracked?: boolean | null }).stock_tracked === false) return false;
    const cur = Number(i.current_qty ?? 0);
    const max = Number(i.max_qty ?? 0);
    return max > 0 && cur <= max * LOW_STOCK_FRACTION;
  });

  // One bar per DAY, not per report row: with a fleet, every machine files its
  // own daily report, so plotting rows directly would draw N bars per date.
  const byDay = new Map<string, number>();
  for (const r of reports) {
    const day = String(r.report_date ?? '');
    if (!day) continue;
    byDay.set(day, (byDay.get(day) ?? 0) + Number(r.total_revenue ?? 0));
  }
  const revenueByDay = [...byDay.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-42)
    .map(([day, revenue]) => ({ day: day.slice(5), revenue }));
  const hasRevenue = revenueByDay.some((d) => d.revenue > 0);

  const recentTx = [...txRows].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {machineRows.length} machine{machineRows.length === 1 ? '' : 's'} · {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile
          label="Machines online" icon={Box}
          value={`${onlineCount} / ${machineRows.length}`}
          sub={onlineCount < machineRows.length ? `${machineRows.length - onlineCount} offline` : 'All reporting'}
          tone={onlineCount < machineRows.length ? 'warn' : 'good'}
        />
        <StatTile
          label="Net revenue" icon={Banknote}
          value={fmtCurrency(netRevenue)} sub="Voids already backed out"
        />
        <StatTile
          label="Settled sales" icon={CreditCard}
          value={String(settledCount)}
          sub={reversedCount ? `${reversedCount} voided` : 'None voided'}
        />
        <StatTile
          label="Slots low" icon={PackageX}
          value={String(lowSlots.length)}
          sub={lowSlots.length ? 'At or below 25% full' : 'All slots stocked'}
          tone={lowSlots.length ? 'warn' : 'good'}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Net revenue by day</h3>
        {hasRevenue ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueByDay} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="day" tickLine={false} axisLine={false}
                     tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} width={56}
                     tick={{ fill: '#64748B', fontSize: 12 }}
                     tickFormatter={(v) => fmtCurrency(v)} />
              <Tooltip
                cursor={{ fill: '#F8FAFC' }}
                formatter={(v: number) => [fmtCurrency(v), 'Net revenue']}
                contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
              />
              <Bar dataKey="revenue" fill={BRAND_HUE} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyPlot message={reports.length ? 'Every sale so far has been voided — net is zero.' : 'No sales recorded yet.'} />
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent transactions</h3>
          <Link to="/transactions" className="text-sm text-[var(--color-brand)] hover:underline">View all</Link>
        </div>
        {recentTx.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-500">No transactions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {['Time', 'Amount', 'Status', 'Slot', 'Card', 'Reference'].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTx.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">{fmtValue('created_at', t.created_at)}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{fmtValue('amount', t.amount)}</td>
                    <td className="px-4 py-2"><StatusBadge status={String(t.payment_status ?? '')} /></td>
                    <td className="px-4 py-2 text-sm text-gray-600">{fmtValue('slot_number', t.slot_number)}</td>
                    <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">
                      {t.card_last_four ? `${fmtValue('card_brand', t.card_brand)} ••${t.card_last_four}` : fmtValue('card_brand', t.card_brand)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500 font-mono text-xs">{fmtValue('payment_ref', t.payment_ref)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
