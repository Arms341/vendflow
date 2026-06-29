import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface OperatorWebsiteItem {
  id: number;
  [key: string]: unknown;
}

export default function OperatorWebsitePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['operator_websites'],
    queryFn: () => api.get('/operator_websites/').then(r => r.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Operator Websites</div>;

  const items: OperatorWebsiteItem[] = Array.isArray(data) ? data : data?.items ?? [];
  const columns = ['id', 'name'];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Operator Websites</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col: any) => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item: any) => (
              <tr key={item.id}>
                {columns.map((col: any) => (
                  <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {String(item[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
