// JARVIS App — AnalyticsDashboard (CONTRACT-FIRST dashboard archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_dashboard_page).
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { listDailyReports, listMachines, listWholesaleAccounts, listWholesaleOrders } from '@/lib/apiClient';
import type { DailyReportResponse, MachineResponse, WholesaleAccountResponse, WholesaleOrderResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue, fmtCurrency } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type ChartDatum = { name: string; count: number };

export default function AnalyticsDashboard() {
  const refLabel = useRefLabels(["machine_id"]);   // S204: parents by name
  const { data: dailyReportsData, isLoading: dailyReportsLoading } = useQuery<DailyReportResponse[]>({
    queryKey: ["daily_reports"],
    queryFn: () => listDailyReports(),
  });
  const { data: machinesData, isLoading: machinesLoading } = useQuery<MachineResponse[]>({
    queryKey: ["machines"],
    queryFn: () => listMachines(),
  });
  const { data: wholesaleAccountsData, isLoading: wholesaleAccountsLoading } = useQuery<WholesaleAccountResponse[]>({
    queryKey: ["wholesale_accounts"],
    queryFn: () => listWholesaleAccounts(),
  });
  const { data: wholesaleOrdersData, isLoading: wholesaleOrdersLoading } = useQuery<WholesaleOrderResponse[]>({
    queryKey: ["wholesale_orders"],
    queryFn: () => listWholesaleOrders(),
  });

  const isLoading = dailyReportsLoading || machinesLoading || wholesaleAccountsLoading || wholesaleOrdersLoading;
  if (isLoading) return <LoadingSpinner />;

  const wholesaleOrdersCount: number = (wholesaleOrdersData ?? []).length;
  const wholesaleAccountsCount: number = (wholesaleAccountsData ?? []).length;
  const dailyReportsCount: number = (dailyReportsData ?? []).length;
  const machinesCount: number = (machinesData ?? []).length;
  const sum0: number = (dailyReportsData ?? []).reduce((acc: number, r: DailyReportResponse) => acc + Number(r.total_revenue ?? 0), 0);
  const sum1: number = (dailyReportsData ?? []).reduce((acc: number, r: DailyReportResponse) => acc + Number(r.card_revenue ?? 0), 0);
  const chart0: ChartDatum[] = ["pending", "fulfilled", "cancelled"].map((v: string) => ({
    name: v,
    count: (wholesaleOrdersData ?? []).filter((r: WholesaleOrderResponse) => r.fulfillment_status === v).length,
  }));
  const chart1: ChartDatum[] = ["card_on_file", "account", "invoice", "cash"].map((v: string) => ({
    name: v,
    count: (wholesaleOrdersData ?? []).filter((r: WholesaleOrderResponse) => r.payment_method === v).length,
  }));
  const chart2: ChartDatum[] = ["active", "inactive", "suspended"].map((v: string) => ({
    name: v,
    count: (wholesaleAccountsData ?? []).filter((r: WholesaleAccountResponse) => r.status === v).length,
  }));
  const recentRows: DailyReportResponse[] = [...(dailyReportsData ?? [])].sort((a: DailyReportResponse, b: DailyReportResponse) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 8);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Wholesale Orders</div>
          <div className="text-2xl font-bold">{wholesaleOrdersCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Wholesale Accounts</div>
          <div className="text-2xl font-bold">{wholesaleAccountsCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Daily Reports</div>
          <div className="text-2xl font-bold">{dailyReportsCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Machines</div>
          <div className="text-2xl font-bold">{machinesCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-2xl font-bold">{fmtCurrency(sum0)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Card Revenue</div>
          <div className="text-2xl font-bold">{fmtCurrency(sum1)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold mb-2">Wholesale Orders by Fulfillment Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chart0}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold mb-2">Wholesale Orders by Payment Method</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chart1}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold mb-2">Wholesale Accounts by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chart2}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Daily Reports</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Report Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Transactions</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Card Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentRows.map((row: DailyReportResponse) => (
                <tr key={row.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{refLabel("machine_id", row.machine_id) ?? fmtValue("machine_id", row.machine_id)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{fmtValue("report_date", row.report_date)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{fmtValue("total_transactions", row.total_transactions)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{fmtValue("total_revenue", row.total_revenue)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{fmtValue("card_revenue", row.card_revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
