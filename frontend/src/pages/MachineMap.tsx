// JARVIS App — MachineMap v2.0.0
// Live geographic fleet map. Self-contained SVG — no map library, no tile
// servers, no extra dependencies. Plots every machine at its location's real
// lat/long, color-coded by live status, with West-Texas city labels, status
// filters, hover tooltip, and click-for-detail. Projection bounds are computed
// from the data at runtime, so it works for any region the locations cover.
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Machine, Location } from '@/types/index';
import LoadingSpinner from '@/components/LoadingSpinner';

type StatusKey = 'online' | 'maintenance' | 'offline' | 'error';

const STATUS_META: Record<StatusKey, { label: string; fill: string; chip: string }> = {
  online: { label: 'Online', fill: '#10b981', chip: 'bg-emerald-500' },
  maintenance: { label: 'Maintenance', fill: '#f59e0b', chip: 'bg-amber-500' },
  offline: { label: 'Offline', fill: '#9ca3af', chip: 'bg-gray-400' },
  error: { label: 'Error', fill: '#ef4444', chip: 'bg-red-500' },
};
const STATUS_ORDER: StatusKey[] = ['online', 'maintenance', 'offline', 'error'];

// Backend stores status as active/maintenance/offline (not "online"); normalize.
function normStatus(s: string | null | undefined): StatusKey {
  const v = String(s ?? '').toLowerCase();
  if (v === 'active' || v === 'online' || v === 'operational' || v === 'ok' || v === 'running') return 'online';
  if (v === 'maintenance' || v === 'servicing' || v === 'repair' || v === 'service') return 'maintenance';
  if (v === 'error' || v === 'fault' || v === 'down' || v === 'alarm' || v === 'critical') return 'error';
  return 'offline';
}

// Real West-Texas city anchors for geographic context (label layer only).
const CITY_ANCHORS: { name: string; lat: number; lng: number }[] = [
  { name: 'Amarillo', lat: 35.222, lng: -101.8313 },
  { name: 'Plainview', lat: 34.1845, lng: -101.7068 },
  { name: 'Wichita Falls', lat: 33.9137, lng: -98.4934 },
  { name: 'Levelland', lat: 33.5873, lng: -102.3779 },
  { name: 'Lubbock', lat: 33.5779, lng: -101.8552 },
  { name: 'Snyder', lat: 32.7179, lng: -100.9176 },
  { name: 'Abilene', lat: 32.4487, lng: -99.7331 },
  { name: 'Big Spring', lat: 32.2504, lng: -101.4787 },
  { name: 'Midland', lat: 31.9974, lng: -102.0779 },
  { name: 'Odessa', lat: 31.8457, lng: -102.3676 },
];

const VB_W = 1000;
const VB_H = 620;
const PAD = 64;

interface Pin {
  id: number;
  x: number;
  y: number;
  status: StatusKey;
  machine: Machine;
  locName: string;
}

export default function MachineMap() {
  const [selected, setSelected] = useState<Machine | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [enabled, setEnabled] = useState<Record<StatusKey, boolean>>({
    online: true,
    maintenance: true,
    offline: true,
    error: true,
  });

  const { data: machines, isLoading, error } = useQuery<Machine[]>({
    queryKey: ['machines', 'map'],
    queryFn: () => api.get('/machines/?limit=1000').then((r) => r.data),
  });
  const { data: locationsData } = useQuery<Location[]>({
    queryKey: ['locations', 'map'],
    queryFn: () => api.get('/locations/?limit=1000').then((r) => r.data),
  });

  const locById = useMemo(() => {
    const m = new Map<number, Location>();
    (locationsData ?? []).forEach((l) => m.set(l.id, l));
    return m;
  }, [locationsData]);

  // Equirectangular projection with cos(lat) longitude correction; bounds from data.
  const project = useMemo(() => {
    const lats: number[] = [];
    const lngs: number[] = [];
    locById.forEach((l) => {
      if (typeof l.latitude === 'number' && typeof l.longitude === 'number') {
        lats.push(l.latitude);
        lngs.push(l.longitude);
      }
    });
    CITY_ANCHORS.forEach((c) => {
      lats.push(c.lat);
      lngs.push(c.lng);
    });
    let minLat = lats.length ? Math.min(...lats) : 31.8;
    let maxLat = lats.length ? Math.max(...lats) : 35.3;
    let minLng = lngs.length ? Math.min(...lngs) : -102.5;
    let maxLng = lngs.length ? Math.max(...lngs) : -98.4;
    const latPad = (maxLat - minLat) * 0.06 || 0.25;
    const lngPad = (maxLng - minLng) * 0.06 || 0.25;
    minLat -= latPad;
    maxLat += latPad;
    minLng -= lngPad;
    maxLng += lngPad;
    const meanLat = (minLat + maxLat) / 2;
    const cosLat = Math.cos((meanLat * Math.PI) / 180) || 1;
    const wLng = (maxLng - minLng) * cosLat;
    const hLat = maxLat - minLat;
    const innerW = VB_W - PAD * 2;
    const innerH = VB_H - PAD * 2;
    const scale = Math.min(innerW / wLng, innerH / hLat);
    const offX = PAD + (innerW - wLng * scale) / 2;
    const offY = PAD + (innerH - hLat * scale) / 2;
    const toXY = (lat: number, lng: number): { x: number; y: number } => ({
      x: offX + (lng - minLng) * cosLat * scale,
      y: offY + (maxLat - lat) * scale,
    });
    return { minLat, maxLat, minLng, maxLng, toXY };
  }, [locById]);

  const pins = useMemo<Pin[]>(() => {
    const out: Pin[] = [];
    (machines ?? []).forEach((mc) => {
      const loc = mc.location_id != null ? locById.get(mc.location_id) : undefined;
      if (!loc || typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') return;
      const base = project.toXY(loc.latitude, loc.longitude);
      // Deterministic jitter so machines sharing a location fan out instead of stacking.
      const angle = (mc.id * 2.399963) % (Math.PI * 2);
      const radius = 3 + ((mc.id * 13) % 13);
      out.push({
        id: mc.id,
        x: base.x + Math.cos(angle) * radius,
        y: base.y + Math.sin(angle) * radius,
        status: normStatus(mc.status),
        machine: mc,
        locName: loc.name,
      });
    });
    return out;
  }, [machines, locById, project]);

  const counts = useMemo(() => {
    const c: Record<StatusKey, number> = { online: 0, maintenance: 0, offline: 0, error: 0 };
    pins.forEach((p) => {
      c[p.status] += 1;
    });
    return c;
  }, [pins]);

  if (isLoading) return <LoadingSpinner fullPage />;
  if (error) return <div className="p-6 text-red-600">Failed to load machines</div>;

  const visiblePins = pins.filter((p) => enabled[p.status]);
  const cityPts = CITY_ANCHORS.map((c) => ({ name: c.name, ...project.toXY(c.lat, c.lng) }));
  const hoveredPin = hovered != null ? pins.find((p) => p.id === hovered) ?? null : null;
  const toggle = (k: StatusKey) => setEnabled((e) => ({ ...e, [k]: !e[k] }));

  const lngLines: number[] = [];
  for (let lng = Math.ceil(project.minLng); lng <= Math.floor(project.maxLng); lng += 1) lngLines.push(lng);
  const latLines: number[] = [];
  for (let lat = Math.ceil(project.minLat); lat <= Math.floor(project.maxLat); lat += 1) latLines.push(lat);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Machine Map</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Chancey Ice Co. · {pins.length} machines across West Texas
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live fleet positions
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
          <div className="text-2xl font-bold text-gray-900">{pins.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Total machines</div>
        </div>
        {STATUS_ORDER.map((k) => {
          const on = enabled[k];
          return (
            <button
              key={k}
              onClick={() => toggle(k)}
              className={`text-left rounded-xl border px-4 py-3 transition ${
                on ? 'border-gray-200 bg-white' : 'border-dashed border-gray-200 bg-gray-50 opacity-60'
              }`}
              title={on ? `Hide ${STATUS_META[k].label}` : `Show ${STATUS_META[k].label}`}
            >
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${STATUS_META[k].chip}`} />
                <span className="text-2xl font-bold text-gray-900">{counts[k]}</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {STATUS_META[k].label}
                {on ? '' : ' · hidden'}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="w-full h-auto block select-none"
          role="img"
          aria-label="Map of machines across West Texas"
        >
          <defs>
            <radialGradient id="vfMapBg" cx="50%" cy="40%" r="80%">
              <stop offset="0%" stopColor="#f5f7ff" />
              <stop offset="100%" stopColor="#eef1f6" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#vfMapBg)" />

          {lngLines.map((lng) => {
            const { x } = project.toXY(project.minLat, lng);
            return <line key={`lng${lng}`} x1={x} y1={PAD * 0.5} x2={x} y2={VB_H - PAD * 0.5} stroke="#e5e7eb" strokeWidth={1} />;
          })}
          {latLines.map((lat) => {
            const { y } = project.toXY(lat, project.minLng);
            return <line key={`lat${lat}`} x1={PAD * 0.5} y1={y} x2={VB_W - PAD * 0.5} y2={y} stroke="#e5e7eb" strokeWidth={1} />;
          })}

          {cityPts.map((c) => (
            <g key={c.name}>
              <circle cx={c.x} cy={c.y} r={3} fill="#94a3b8" />
              <text x={c.x + 7} y={c.y + 4} fontSize={13} fill="#64748b" fontWeight={600}>
                {c.name}
              </text>
            </g>
          ))}

          {visiblePins.map((p) => {
            const isHover = hovered === p.id;
            return (
              <circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={isHover ? 7 : 4.5}
                fill={STATUS_META[p.status].fill}
                stroke="#ffffff"
                strokeWidth={isHover ? 2 : 1.25}
                opacity={0.92}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered((h) => (h === p.id ? null : h))}
                onClick={() => setSelected(p.machine)}
              >
                <title>{`${p.machine.name || p.machine.serial_number} — ${STATUS_META[p.status].label} — ${p.locName}`}</title>
              </circle>
            );
          })}

          {hoveredPin && <MapTooltip pin={hoveredPin} />}
        </svg>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl border border-gray-200 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selected.name || selected.serial_number}</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <Row label="Serial number" value={selected.serial_number} />
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${STATUS_META[normStatus(selected.status)].chip}`} />
                    {STATUS_META[normStatus(selected.status)].label}
                  </p>
                </div>
                <Row
                  label="Location"
                  value={
                    selected.location_id != null ? locById.get(selected.location_id)?.name ?? 'Unknown' : 'Unassigned'
                  }
                />
                <Row label="Manufacturer" value={selected.manufacturer ?? 'N/A'} />
                <Row label="Model" value={selected.model ?? 'N/A'} />
                <Row label="Machine type" value={selected.machine_type ?? 'N/A'} />
                <Row label="Firmware" value={selected.firmware_version ?? 'N/A'} />
                <Row label="Temperature" value={selected.temperature != null ? `${selected.temperature}°C` : 'N/A'} />
                <Row
                  label="Last telemetry"
                  value={selected.last_telemetry_at ? new Date(selected.last_telemetry_at).toLocaleString() : 'Never'}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MapTooltip({ pin }: { pin: Pin }) {
  const label = pin.machine.name || pin.machine.serial_number;
  const sub = `${STATUS_META[pin.status].label} · ${pin.locName}`;
  const w = Math.max(label.length, sub.length) * 7 + 24;
  const tx = Math.min(Math.max(pin.x - w / 2, 6), VB_W - w - 6);
  const ty = pin.y - 54 < 6 ? pin.y + 16 : pin.y - 54;
  return (
    <g pointerEvents="none">
      <rect x={tx} y={ty} width={w} height={40} rx={8} fill="#0f172a" opacity={0.92} />
      <text x={tx + 12} y={ty + 17} fontSize={13} fill="#ffffff" fontWeight={700}>
        {label}
      </text>
      <text x={tx + 12} y={ty + 32} fontSize={11} fill="#cbd5e1">
        {sub}
      </text>
    </g>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-900 break-words">{value}</p>
    </div>
  );
}
