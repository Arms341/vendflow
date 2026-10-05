// JARVIS App — MachineMap (CONTRACT-FIRST map archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_map_page).
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listLocations, listMachines } from '@/lib/apiClient';
import type { LocationResponse, MachineResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';

type Place = LocationResponse;
type Item = MachineResponse;

const MAP_W = 800;
const MAP_H = 420;
const MAP_PAD = 48;

export default function MachineMap() {
  const { data: placesData, isLoading: placesLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: () => listLocations(),
  });
  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ["machines"],
    queryFn: () => listMachines(),
  });

  const places: Place[] = placesData ?? [];
  const items: Item[] = itemsData ?? [];

  const geo = useMemo(
    () => places.filter((p: Place) => p.latitude != null && p.longitude != null),
    [places],
  );

  const bounds = useMemo(() => {
    const lats = geo.map((p: Place) => Number(p.latitude ?? 0));
    const lons = geo.map((p: Place) => Number(p.longitude ?? 0));
    const minLat = lats.length ? Math.min(...lats) : 0;
    const maxLat = lats.length ? Math.max(...lats) : 0;
    const minLon = lons.length ? Math.min(...lons) : 0;
    const maxLon = lons.length ? Math.max(...lons) : 0;
    return {
      minLat, minLon,
      spanLat: (maxLat - minLat) || 1,
      spanLon: (maxLon - minLon) || 1,
    };
  }, [geo]);

  const project = (lat: number, lon: number): { x: number; y: number } => ({
    x: MAP_PAD + ((lon - bounds.minLon) / bounds.spanLon) * (MAP_W - 2 * MAP_PAD),
    y: MAP_H - MAP_PAD - ((lat - bounds.minLat) / bounds.spanLat) * (MAP_H - 2 * MAP_PAD),
  });

  const itemsAt = (placeId: number): Item[] =>
    items.filter((it: Item) => it.location_id === placeId);

  if (placesLoading || itemsLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Machines Map</h1>
        <p className="text-sm text-gray-500">Machines across locations</p>
      </div>

      {geo.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          No mapped locations yet — add coordinates to see them here.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full h-auto">
            <rect x={0} y={0} width={MAP_W} height={MAP_H} className="fill-slate-50" />
            {geo.map((p: Place) => {
              const pt = project(Number(p.latitude ?? 0), Number(p.longitude ?? 0));
              const count = itemsAt(p.id).length;
              return (
                <g key={p.id}>
                  <circle cx={pt.x} cy={pt.y} r={12} className="fill-blue-600 opacity-80" />
                  <text x={pt.x} y={pt.y + 4} textAnchor="middle" className="fill-white text-[10px] font-semibold">{count}</text>
                  <text x={pt.x} y={pt.y - 16} textAnchor="middle" className="fill-slate-700 text-[11px]">{String(p.name ?? '')}</text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((p: Place) => {
          const at = itemsAt(p.id);
          return (
            <div key={p.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="font-semibold text-gray-900">{String(p.name ?? '')}</div>
              <div className="text-xs text-gray-500 mb-2">{[p.address, p.city, p.state].filter(Boolean).join(', ')}</div>
              <div className="text-sm text-gray-700 mb-1">{at.length} machines</div>
              <ul className="space-y-1">
                {at.slice(0, 8).map((it: Item) => (
                  <li key={it.id} className="flex justify-between text-xs">
                    <span className="text-gray-700">{String(it.name ?? '')}</span>
                    <span className="text-gray-400">{String(it.status ?? '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
