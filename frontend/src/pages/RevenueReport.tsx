import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

function formatMoney(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return '$0.00';
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  if (Number.isNaN(n)) return '$0.00';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function RevenueReport() {
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['reports', 'revenue', timeRange],
    queryFn: () => api.get('/reports/revenue').then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return (
    <div className="p-6 text-red-600">
      Failed to load revenue report: {String(error)}
    </div>
  );
  if (!data) return <div className="p-6 text-gray-600">No data available</div>;

  const revenueData = data.revenue_data ?? [];
  const totalRevenue = revenueData.reduce((sum: any, item: any) => sum + (item.revenue ?? 0), 0);
  const totalOrders = revenueData.reduce((sum: any, item: any) => sum + (item.order_count ?? 0), 0);
  
  const categoryData = (data.category_breakdown ?? []).map((item: any) => ({
    name: item.category ?? 'Unknown',
    value: item.revenue ?? 0,
    color: COLORS[(data.category_breakdown ?? []).indexOf(item) % COLORS.length],
  }));

  const monthlyData = revenueData.map((item: any) => ({
    name: item.month ?? 'Unknown',
    revenue: item.revenue ?? 0,
    orders: item.order_count ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Revenue Report</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'monthly'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeRange('quarterly')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'quarterly'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setTimeRange('yearly')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'yearly'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatMoney(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalOrders > 0 ? formatMoney(totalRevenue / totalOrders) : '$0.00'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Revenue by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => [formatMoney(value), 'Revenue']} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {categoryData.map((entry: any, i: any) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [formatMoney(value), 'Revenue']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Revenue Details</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-2">Period</th>
              <th className="px-4 py-2">Revenue</th>
              <th className="px-4 py-2">Orders</th>
              <th className="px-4 py-2">Avg. Order Value</th>
            </tr>
          </thead>
          <tbody>
            {(revenueData ?? []).map((item: any, i: any) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium text-gray-900">{item.month ?? 'Unknown'}</td>
                <td className="px-4 py-2 text-gray-600">{formatMoney(item.revenue ?? 0)}</td>
                <td className="px-4 py-2 text-gray-600">{item.order_count ?? 0}</td>
                <td className="px-4 py-2 text-gray-600">
                  {item.order_count && item.order_count > 0
                    ? formatMoney((item.revenue ?? 0) / (item.order_count ?? 0))
                    : '$0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}