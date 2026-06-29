import { useQuery } from '@tanstack/react-query';
import { Alert } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AlertList() {
  const { data, isLoading, isError, error } = useQuery<Alert[]>({
    queryKey: ['alerts', 'unacknowledged'],
    queryFn: () => api.get('/alerts/unacknowledged').then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="p-6 text-red-600">Failed to load alerts: {String(error)}</div>;
  if (!data) return <div className="p-6 text-gray-600">No alerts found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Unacknowledged Alerts</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Severity</th>
              <th className="px-6 py-3">Message</th>
              <th className="px-6 py-3">Machine ID</th>
              <th className="px-6 py-3">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((alert: any) => (
              <tr key={alert.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {alert.alert_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${alert.severity === 'high' ? 'bg-red-100 text-red-800' : 
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      alert.severity === 'low' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {alert.severity ?? 'unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                  {alert.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alert.machine_id ?? 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alert.created_at ? new Date(alert.created_at).toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}