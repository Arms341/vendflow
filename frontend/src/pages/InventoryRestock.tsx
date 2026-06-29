import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Machine } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function InventoryRestock() {
  const { data, isLoading, isError, error } = useQuery<Machine[]>({
    queryKey: ['machines'],
    queryFn: () => api.get('/machines/').then((r) => r.data),
  });

  const [restockQuantities, setRestockQuantities] = useState<Record<number, number>>({});

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="p-6 text-red-600">Failed to load machines: {String(error)}</div>;
  if (!data) return <div className="p-6 text-gray-600">No machines found</div>;

  const handleQuantityChange = (machineId: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;
    setRestockQuantities(prev => ({ ...prev, [machineId]: numValue }));
  };

  const handleSubmit = () => {
    // In a real app, this would POST to an endpoint to process the restock
    console.log('Submitting restock:', restockQuantities);
    alert('Restock submitted successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Restock</h1>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Confirm Restock
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((machine: any) => (
          <div key={machine.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {machine.name ?? machine.serial_number}
                </h2>
                <p className="text-sm text-gray-500">
                  {machine.machine_type ?? 'Machine'}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                machine.is_online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {machine.is_online ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Serial Number
                </label>
                <p className="mt-1 text-sm text-gray-900">{machine.serial_number}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Quantity
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {machine.last_restock_at ? 'Restocked' : 'Not restocked'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Restock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={restockQuantities[machine.id] ?? ''}
                  onChange={(e) => handleQuantityChange(machine.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}