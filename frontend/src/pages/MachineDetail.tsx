import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Machine } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AlertTriangle, Package, Calendar, Wifi, Clock, MapPin, User } from 'lucide-react';

function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString();
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export default function MachineDetail() {
  const { id } = useParams<{ id: string }>();
  const machineId = Number(id);

  const {
    data: machine,
    isLoading,
    isError,
    error,
  } = useQuery<Machine>({
    queryKey: ['machines', machineId],
    queryFn: () => api.get(`/machines/${machineId}/`).then((r) => r.data),
    enabled: !!machineId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !machine) {
    return (
      <div className="p-6 text-red-600">
        Failed to load machine details: {error?.message || 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {machine.name || `Machine ${machine.id}`}
          </h1>
          <p className="text-gray-600">
            {machine.machine_type || 'Unknown Type'} • Serial: {machine.serial_number}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${machine.is_online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium">
            {machine.is_online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Machine Information</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Manufacturer</p>
                <p className="text-sm text-gray-600">{machine.manufacturer ?? 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Package className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Model</p>
                <p className="text-sm text-gray-600">{machine.model ?? 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">
                  {machine.location_id ? `Location ${machine.location_id}` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Operator</p>
                <p className="text-sm text-gray-600">
                  {machine.operator_id ? `Operator ${machine.operator_id}` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Installed At</p>
                <p className="text-sm text-gray-600">{formatDate(machine.installed_at)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Last Service</p>
                <p className="text-sm text-gray-600">{formatDate(machine.last_service_at)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Last Restock</p>
                <p className="text-sm text-gray-600">{formatDate(machine.last_restock_at)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <Wifi className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Terminal ID</p>
                <p className="text-sm text-gray-600">{machine.terminal_id ?? 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Wifi className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">PI Device ID</p>
                <p className="text-sm text-gray-600">{machine.pi_device_id ?? 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Wifi className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">SIM ICCID</p>
                <p className="text-sm text-gray-600">{machine.sim_iccid ?? 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Firmware Version</p>
                <p className="text-sm text-gray-600">{machine.firmware_version ?? 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Edge Mode</p>
                <p className="text-sm text-gray-600">{machine.edge_mode ?? 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Connectivity Type</p>
                <p className="text-sm text-gray-600">{machine.connectivity_type ?? 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Temperature</p>
                <p className="text-sm text-gray-600">
                  {machine.temperature !== null ? `${machine.temperature}°C` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            machine.status === 'active' ? 'bg-green-100 text-green-800' :
            machine.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
            machine.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {machine.status || 'Unknown'}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            machine.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {machine.is_active ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>
    </div>
  );
}