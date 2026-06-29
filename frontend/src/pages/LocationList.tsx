import { useQuery } from '@tanstack/react-query';
import { Location } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LocationList() {
  const { data, isLoading, isError } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: () => api.get('/locations/').then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <div className="p-6 text-red-600">Failed to load locations</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Locations</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">Zip Code</th>
              <th className="px-4 py-2">Operator ID</th>
            </tr>
          </thead>
          <tbody>
            {data.map((location: any) => (
              <tr key={location.id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium text-gray-900">{location.name}</td>
                <td className="px-4 py-2 text-gray-600">{location.address ?? ''}</td>
                <td className="px-4 py-2 text-gray-600">{location.city ?? ''}</td>
                <td className="px-4 py-2 text-gray-600">{location.state ?? ''}</td>
                <td className="px-4 py-2 text-gray-600">{location.zip_code ?? ''}</td>
                <td className="px-4 py-2 text-gray-600">{location.operator_id ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}