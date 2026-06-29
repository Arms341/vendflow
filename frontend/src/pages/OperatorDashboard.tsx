import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Activity, DollarSign, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import { Machine } from '@/types/index';
import LoadingSpinner from '@/components/LoadingSpinner';

function formatMoney(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return '$0.00';
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  if (Number.isNaN(n)) return '$0.00';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
}

export default function OperatorDashboard() {
  const {
    data: machines,
    isLoading: machinesLoading,
    error: machinesError,
  } = useQuery<Machine[]>({
    queryKey: ['machines'],
    queryFn: () => api.get('/machines/').then((r) => r.data),
  });

  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => api.get('/transactions/').then((r) => r.data),
  });

  const {
    data: alerts,
    isLoading: alertsLoading,
    error: alertsError,
  } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => api.get('/alerts/').then((r) => r.data),
  });

  const {
    data: dailyReports,
    isLoading: dailyReportsLoading,
    error: dailyReportsError,
  } = useQuery({
    queryKey: ['daily_reports'],
    queryFn: () => api.get('/daily_reports/').then((r) => r.data),
  });

  if (machinesLoading || transactionsLoading || alertsLoading || dailyReportsLoading) {
    return <LoadingSpinner />;
  }

  if (machinesError || transactionsError || alertsError || dailyReportsError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load dashboard data
      </div>
    );
  }

  const totalMachines = machines?.length ?? 0;
  const activeMachines = machines?.filter((m: any) => m.is_active).length ?? 0;
  const onlineMachines = machines?.filter((m: any) => m.is_online).length ?? 0;
  const revenue = transactions?.reduce((sum: any, t: any) => sum + (t.amount ?? 0), 0) ?? 0;
  const activeAlerts = alerts?.filter((a: any) => a.status === 'active').length ?? 0;

  const machineStatusData = [
    { name: 'Active', value: activeMachines },
    { name: 'Inactive', value: totalMachines - activeMachines },
    { name: 'Online', value: onlineMachines },
    { name: 'Offline', value: totalMachines - onlineMachines },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Operator Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Machines</p>
              <p className="text-2xl font-semibold text-gray-900">{totalMachines}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Machines</p>
              <p className="text-2xl font-semibold text-gray-900">{activeMachines}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Online Machines</p>
              <p className="text-2xl font-semibold text-gray-900">{onlineMachines}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">{formatMoney(revenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Machine Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={machineStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="Count" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Active Alerts</h3>
          <div className="space-y-3">
            {alerts?.slice(0, 5).map((alert: any) => (
              <div key={alert.id} className="flex items-start p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{alert.description}</p>
                  <p className="text-xs text-gray-500">{alert.created_at}</p>
                </div>
              </div>
            ))}
            {alerts && alerts.length === 0 && (
              <p className="text-sm text-gray-500">No active alerts</p>
            )}
          </div>
        </div>
      </div>

      {/* Machine status table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Machine Status Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Telemetry</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {machines?.slice(0, 10).map((machine: any) => (
                <tr key={machine.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{machine.name ?? machine.serial_number}</div>
                    <div className="text-sm text-gray-500">{machine.serial_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {machine.machine_type ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${machine.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {machine.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${machine.is_online ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {machine.is_online ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {machine.location_id ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {machine.last_telemetry_at ? new Date(machine.last_telemetry_at).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}