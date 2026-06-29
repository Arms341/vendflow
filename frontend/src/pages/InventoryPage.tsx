import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface InventoryItem {
  id: number;
  [key: string]: unknown;
}

export default function InventoryPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['inventories'],
    queryFn: () => api.get('/inventories/').then(r => r.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Inventories</div>;

  const items: InventoryItem[] = Array.isArray(data) ? data : data?.items ?? [];
  const columns = ['id', 'name'];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventories</h1>
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
