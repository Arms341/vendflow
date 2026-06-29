import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, Activity } from 'lucide-react';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Analytics } from '@/types/index';

function formatMoney(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return '$0.00';
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  if (Number.isNaN(n)) return '$0.00';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
}

const STATUS_COLORS: Record<string, string> = {
  active: '#10B981',
  inactive: '#EF4444',
  pending: '#F59E0B',
  completed: '#3B82F6',
};

export default function AnalyticsDashboard() {
  const { data, isLoading, isError } = useQuery<Analytics[]>({
    queryKey: ['analytics'],
    queryFn: () => api.get('/analytics/').then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <div className="p-6 text-red-600">Failed to load analytics data</div>;

  // Prepare data for charts
  const transactionsData = data
    .filter((item: any) => item.title === 'transaction')
    .map((item: any) => ({
      name: item.description || 'Unknown',
      value: item.id,
      status: item.status || 'unknown',
    }));

  const topProductsData = data
    .filter((item: any) => item.title === 'product')
    .map((item: any) => ({
      name: item.description || 'Unknown Product',
      value: item.id,
      status: item.status || 'unknown',
    }));

  const machineComparisonData = data
    .filter((item: any) => item.title === 'machine')
    .map((item: any) => ({
      name: item.description || 'Unknown Machine',
      value: item.id,
      status: item.status || 'unknown',
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <DollarSign size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">{formatMoney(data.length * 1250)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <Package size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">{data.filter((item: any) => item.title === 'transaction').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <Activity size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Machines</p>
              <p className="text-2xl font-semibold text-gray-900">{data.filter((item: any) => item.title === 'machine' && item.status === 'active').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Transactions by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Transaction Count" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={topProductsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {topProductsData.map((entry: any, i: any) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.status] || '#6B7280'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Machine Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={machineComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Performance Score" fill="var(--color-brand-secondary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}