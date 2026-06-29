// VendFlow — Route Optimization (gig-specific hero page).
// Reads GET /routes/, /machines/, /locations/, resolves each route's stops to
// real West-Texas coordinates, and computes a nearest-neighbor optimized order
// client-side so the operator can SEE the miles saved vs. the as-entered order.
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Navigation, MapPin, Route as RouteIcon, Sparkles, TrendingDown, Clock, User, Calendar,
} from 'lucide-react';
import { api } from '@/lib/api';
import type { Route, Machine, Location } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Stop {
  id: number;
  title: string;
  sub: string;
  lat: number | null;
  lng: number | null;
}

const MPH = 32; // avg service-vehicle speed incl. stops, for ETA estimate

function haversine(a: Stop, b: Stop): number {
  if (a.lat == null || a.lng == null || b.lat == null || b.lng == null) return 0;
  const R = 3958.8;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
function pathMiles(stops: Stop[]): number {
  let d = 0;
  for (let i = 1; i < stops.length; i++) d += haversine(stops[i - 1], stops[i]);
  return d;
}
function nearestNeighbor(stops: Stop[]): Stop[] {
  if (stops.length <= 2) return stops.slice();
  const remaining = stops.slice();
  const ordered: Stop[] = [remaining.shift() as Stop];
  while (remaining.length) {
    const last = ordered[ordered.length - 1];
    let bestIdx = 0;
    let bestD = Infinity;
    remaining.forEach((s, i) => {
      const dd = haversine(last, s);
      if (dd < bestD) { bestD = dd; bestIdx = i; }
    });
    ordered.push(remaining.splice(bestIdx, 1)[0]);
  }
  return ordered;
}
function parseIds(json: string | null | undefined): number[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.map((n) => Number(n)).filter((n) => !Number.isNaN(n)) : [];
  } catch {
    return [];
  }
}
function fmtMiles(n: number): string {
  return `${n.toFixed(1)} mi`;
}
function fmtEta(miles: number): string {
  const mins = Math.round((miles / MPH) * 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  planned: 'bg-amber-100 text-amber-800',
  scheduled: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-red-100 text-red-700',
};

export default function RoutePlanner() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [optimized, setOptimized] = useState(false);

  const routesQ = useQuery<Route[]>({
    queryKey: ['routes'],
    queryFn: () => api.get<Route[]>('/routes/', { params: { limit: 1000 } }).then((r) => r.data),
  });
  const machinesQ = useQuery<Machine[]>({
    queryKey: ['machines', 'all'],
    queryFn: () => api.get<Machine[]>('/machines/', { params: { limit: 1000 } }).then((r) => r.data),
  });
  const locationsQ = useQuery<Location[]>({
    queryKey: ['locations', 'all'],
    queryFn: () => api.get<Location[]>('/locations/', { params: { limit: 1000 } }).then((r) => r.data),
  });

  const machineMap = useMemo(() => {
    const m = new Map<number, Machine>();
    (machinesQ.data ?? []).forEach((x) => m.set(x.id, x));
    return m;
  }, [machinesQ.data]);
  const locationMap = useMemo(() => {
    const m = new Map<number, Location>();
    (locationsQ.data ?? []).forEach((x) => m.set(x.id, x));
    return m;
  }, [locationsQ.data]);

  const routes = routesQ.data ?? [];
  const selected: Route | null =
    routes.find((r) => r.id === selectedId) ?? routes[0] ?? null;

  const baseStops: Stop[] = useMemo(() => {
    if (!selected) return [];
    return parseIds(selected.machine_ids_json).map((mid) => {
      const m = machineMap.get(mid);
      const loc = m && m.location_id != null ? locationMap.get(m.location_id) : undefined;
      return {
        id: mid,
        title: (m && (m.serial_number || m.name)) || `Machine #${mid}`,
        sub: loc ? `${loc.name}${loc.city ? ` · ${loc.city}` : ''}` : 'Unknown location',
        lat: loc?.latitude ?? null,
        lng: loc?.longitude ?? null,
      };
    });
  }, [selected, machineMap, locationMap]);

  const optimizedStops = useMemo(() => nearestNeighbor(baseStops), [baseStops]);
  const naiveMiles = useMemo(() => pathMiles(baseStops), [baseStops]);
  const optMiles = useMemo(() => pathMiles(optimizedStops), [optimizedStops]);
  const saved = Math.max(0, naiveMiles - optMiles);
  const savedPct = naiveMiles > 0 ? (saved / naiveMiles) * 100 : 0;
  const hasCoords = baseStops.some((s) => s.lat != null && s.lng != null);

  const shownStops = optimized ? optimizedStops : baseStops;
  const shownMiles = optimized ? optMiles : naiveMiles;

  if (routesQ.isLoading || machinesQ.isLoading || locationsQ.isLoading)
    return <LoadingSpinner fullPage />;
  if (routesQ.isError) return <div className="p-6 text-red-600">Failed to load routes.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Route Optimization</h1>
        <p className="mt-1 text-sm text-gray-500">
          Sequence service stops by distance — fewer miles, less windshield time, more machines per shift.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Route list */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-1">
          <h2 className="mb-3 px-1 text-sm font-semibold text-gray-900">Service routes</h2>
          <div className="space-y-2">
            {routes.map((r) => {
              const active = selected?.id === r.id;
              const stopCount = parseIds(r.machine_ids_json).length;
              return (
                <button key={r.id}
                  onClick={() => { setSelectedId(r.id); setOptimized(false); }}
                  className={`block w-full rounded-xl border p-3 text-left transition ${
                    active ? 'border-[var(--color-brand)] bg-indigo-50/40' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-semibold text-gray-900">{r.name}</span>
                    <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status ?? ''] ?? 'bg-gray-100 text-gray-700'}`}>
                      {r.status ?? '—'}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {stopCount} stops</span>
                    {r.scheduled_date && (
                      <span className="inline-flex items-center gap-1"><Calendar size={12} /> {r.scheduled_date}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail + optimization */}
        <div className="space-y-4 lg:col-span-2">
          {!selected ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
              Select a route to plan it.
            </div>
          ) : (
            <>
              {/* Metric cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500"><RouteIcon size={14} /> As entered</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">{fmtMiles(naiveMiles)}</div>
                  <div className="text-xs text-gray-400">≈ {fmtEta(naiveMiles)} drive · {baseStops.length} stops</div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500"><Navigation size={14} /> Optimized</div>
                  <div className="mt-1 text-2xl font-bold text-[var(--color-brand)]">{fmtMiles(optMiles)}</div>
                  <div className="text-xs text-gray-400">≈ {fmtEta(optMiles)} drive · nearest-neighbor</div>
                </div>
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 text-sm text-green-700"><TrendingDown size={14} /> Saved</div>
                  <div className="mt-1 text-2xl font-bold text-green-700">{fmtMiles(saved)}</div>
                  <div className="text-xs text-green-600/80">{savedPct.toFixed(0)}% less driving</div>
                </div>
              </div>

              {/* Header + optimize toggle */}
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1"><User size={12} /> {selected.driver_id ? `Driver #${selected.driver_id}` : 'Unassigned'}</span>
                      {selected.started_at && (
                        <span className="inline-flex items-center gap-1"><Clock size={12} /> started {new Date(selected.started_at).toLocaleDateString()}</span>
                      )}
                      <span>logged {fmtMiles(Number(selected.total_distance_miles ?? 0))}</span>
                    </div>
                  </div>
                  <button onClick={() => setOptimized((v) => !v)} disabled={!hasCoords}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      optimized ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                : 'bg-[var(--color-brand)] text-white hover:opacity-90'}`}>
                    <Sparkles size={15} /> {optimized ? 'Show original order' : 'Optimize route'}
                  </button>
                </div>

                {!hasCoords && (
                  <div className="px-4 pt-3 text-xs text-amber-600">
                    Stops have no geocoded location yet — showing entry order.
                  </div>
                )}

                {/* Stop sequence */}
                <ol className="divide-y divide-gray-100">
                  {shownStops.map((s, idx) => {
                    const prev = idx > 0 ? haversine(shownStops[idx - 1], s) : 0;
                    return (
                      <li key={`${s.id}-${idx}`} className="flex items-center gap-3 p-4">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                          optimized ? 'bg-[var(--color-brand)] text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">{s.title}</p>
                          <p className="truncate text-xs text-gray-400">{s.sub}</p>
                        </div>
                        {idx > 0 && (
                          <span className="shrink-0 text-xs text-gray-400">+{prev.toFixed(1)} mi</span>
                        )}
                      </li>
                    );
                  })}
                  {shownStops.length === 0 && (
                    <li className="p-8 text-center text-sm text-gray-400">No stops assigned to this route.</li>
                  )}
                </ol>

                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3 text-sm">
                  <span className="font-medium text-gray-500">Total</span>
                  <span className="font-bold text-gray-900">{fmtMiles(shownMiles)} · {fmtEta(shownMiles)} driving</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
