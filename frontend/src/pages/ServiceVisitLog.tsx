import { useQuery } from '@tanstack/react-query';
import { ServiceVisit } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { format } from 'date-fns';

function ServiceVisitLog() {
  const { data, isLoading, isError, error } = useQuery<ServiceVisit[]>({
    queryKey: ['service_visits'],
    queryFn: () => api.get('/service_visits/').then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="p-6 text-red-600">Failed to load service visits: {String(error)}</div>;
  if (!data) return <div className="p-6 text-gray-600">No service visits found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Service Visit Log</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cash Collected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products Restocked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues Found</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((visit: any) => (
                <tr key={visit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.machine_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.driver_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.route_id ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.visit_type ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {visit.started_at ? format(new Date(visit.started_at), 'MMM d, yyyy h:mm a') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {visit.completed_at ? format(new Date(visit.completed_at), 'MMM d, yyyy h:mm a') : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{visit.notes ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{visit.cash_collected ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{visit.products_restocked_json ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{visit.issues_found_json ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ServiceVisitLog;