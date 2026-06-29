import { useQuery } from '@tanstack/react-query';
import { Machine } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusBadge from '@/components/StatusBadge';

export default function MachineList() {
  const { data, isLoading, isError, error } = useQuery<Machine[]>({
    queryKey: ['machines'],
    queryFn: () => api.get('/machines/').then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="p-6 text-red-600">Failed to load machines: {error.message}</div>;
  if (!data) return <div className="p-6 text-gray-600">No machines found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Machines</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-6 py-3">Serial Number</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Last Telemetry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((machine: any) => (
              <tr key={machine.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {machine.serial_number ?? '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {machine.name ?? '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {machine.machine_type ?? '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={machine.status ?? 'unknown'} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {machine.location_id ?? '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {machine.last_telemetry_at ? new Date(machine.last_telemetry_at).toLocaleString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}