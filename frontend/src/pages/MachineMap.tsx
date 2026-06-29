import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Machine } from '@/types/index';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Location {
  id: number;
  name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  error: 'bg-red-500',
  maintenance: 'bg-yellow-500',
};

const STATUS_LABELS: Record<string, string> = {
  online: 'Online',
  offline: 'Offline',
  error: 'Error',
  maintenance: 'Maintenance',
};

export default function MachineMap() {
  const [locations, setLocations] = useState<Record<number, Location>>({});
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const { data: machines, isLoading, error } = useQuery<Machine[]>({
    queryKey: ['machines'],
    queryFn: () => api.get('/machines/').then((r) => r.data),
  });

  const { data: locationsData } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: () => api.get('/locations/').then((r) => r.data),
  });

  useEffect(() => {
    if (locationsData) {
      const locMap: Record<number, Location> = {};
      locationsData.forEach((loc: any) => {
        locMap[loc.id] = loc;
      });
      setLocations(locMap);
    }
  }, [locationsData]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-6 text-red-600">Failed to load machines</div>;
  if (!machines) return <div className="p-6 text-gray-600">No machines found</div>;

  const handleMachineClick = (machine: Machine) => {
    setSelectedMachine(machine);
  };

  const handleCloseDetails = () => {
    setSelectedMachine(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Machine Map</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Deployed Machines</h2>
        </div>
        
        <div className="relative h-[600px] bg-gray-100">
          {/* Map placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
            {/* Render machine pins */}
            {machines.map((machine: any) => {
              const location = locations[machine.location_id ?? 0];
              if (!location || location.latitude === null || location.longitude === null) return null;
              
              const status = machine.status?.toLowerCase() || 'offline';
              const statusColor = STATUS_COLORS[status] || 'bg-gray-500';
              const statusLabel = STATUS_LABELS[status] || status;
              
              return (
                <div
                  key={machine.id}
                  className={`absolute w-4 h-4 rounded-full border-2 border-white cursor-pointer transform -translate-x-2 -translate-y-2 transition-all duration-200 hover:scale-125 ${statusColor}`}
                  style={{
                    left: `${50 + (location.longitude ?? 0) * 10}%`,
                    top: `${50 - (location.latitude ?? 0) * 10}%`,
                  }}
                  onClick={() => handleMachineClick(machine)}
                  title={`${machine.name || machine.serial_number} - ${statusLabel}`}
                />
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Status Legend</h3>
            <div className="space-y-1">
              {Object.entries(STATUS_COLORS).map(([status, color]: [string, any]) => (
                <div key={status} className="flex items-center text-xs">
                  <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
                  <span className="text-gray-600">{STATUS_LABELS[status] || status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Machine Details Modal */}
      {selectedMachine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedMachine.name || selectedMachine.serial_number}
                </h3>
                <button 
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Serial Number</p>
                  <p className="font-medium">{selectedMachine.serial_number}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      STATUS_COLORS[selectedMachine.status?.toLowerCase() || 'offline'] || 'bg-gray-500'
                    }`}></span>
                    {STATUS_LABELS[selectedMachine.status?.toLowerCase() || 'offline'] || selectedMachine.status}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {locations[selectedMachine.location_id ?? 0]?.name || 'Unknown Location'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Machine Type</p>
                  <p className="font-medium">{selectedMachine.machine_type || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Manufacturer</p>
                  <p className="font-medium">{selectedMachine.manufacturer || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-medium">{selectedMachine.model || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Firmware Version</p>
                  <p className="font-medium">{selectedMachine.firmware_version || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Temperature</p>
                  <p className="font-medium">{selectedMachine.temperature !== null ? `${selectedMachine.temperature}°C` : 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Last Telemetry</p>
                  <p className="font-medium">
                    {selectedMachine.last_telemetry_at 
                      ? new Date(selectedMachine.last_telemetry_at).toLocaleString() 
                      : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}