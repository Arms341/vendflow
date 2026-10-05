// VendFlow — foreign keys as names  v1.0.0  (S191)
//
// WHY THIS EXISTS: detail and list pages rendered `Operator Id: 1` and
// `Location Id: 3`. The id is the database's business, not the operator's.
// Builder home: Road 1 / B3 — the emitter knows which columns are foreign keys
// (it already builds a <select> of the parent rows on the FORM page), so it can
// render the parent's label on the read pages from the same knowledge.
import { useQueries } from '@tanstack/react-query';
import {
  listOperators, listLocations, listMachines, listProducts, listLandowners, listLeads,
} from '@/lib/apiClient';
import { fetchAll } from '@/lib/paginate';

// Entities do not agree on what their human label is called.
type Row = {
  id?: number | null; name?: string | null; serial_number?: string | null;
  business_name?: string | null; title?: string | null;
};

const SOURCES: { key: string; fk: string; fn: () => Promise<Row[]> }[] = [
  { key: 'operators', fk: 'operator_id', fn: () => fetchAll((q) => listOperators(q) as Promise<Row[]>) },
  { key: 'locations', fk: 'location_id', fn: () => fetchAll((q) => listLocations(q) as Promise<Row[]>) },
  { key: 'machines', fk: 'machine_id', fn: () => fetchAll((q) => listMachines(q) as Promise<Row[]>) },
  { key: 'products', fk: 'product_id', fn: () => fetchAll((q) => listProducts(q) as Promise<Row[]>) },
  { key: 'landowners', fk: 'landowner_id', fn: () => fetchAll((q) => listLandowners(q) as Promise<Row[]>) },
  { key: 'leads', fk: 'lead_id', fn: () => fetchAll((q) => listLeads(q) as Promise<Row[]>) },
];

/**
 * Returns label(fkColumn, id) -> the parent's name, or null when unknown.
 * Only the foreign keys actually present on the record are fetched.
 */
export function useRefLabels(presentKeys: string[]) {
  const needed = SOURCES.filter((s) => presentKeys.includes(s.fk));
  const results = useQueries({
    queries: needed.map((s) => ({
      queryKey: [s.key],
      queryFn: s.fn,
      staleTime: 60_000,
    })),
  });

  const maps: Record<string, Map<number, string>> = {};
  needed.forEach((s, i) => {
    const m = new Map<number, string>();
    const data = (results[i]?.data ?? []) as Row[];
    data.forEach((r) => {
      if (r?.id != null) {
        m.set(r.id, String(r.name ?? r.business_name ?? r.title ?? r.serial_number ?? `#${r.id}`));
      }
    });
    maps[s.fk] = m;
  });

  return (fk: string, id: unknown): string | null => {
    if (id === null || id === undefined || id === '') return null;
    const n = Number(id);
    if (!Number.isFinite(n)) return null;
    return maps[fk]?.get(n) ?? null;
  };
}

export default useRefLabels;
