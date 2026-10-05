// VendFlow — Inventories  v2.0.0  (S191)
// Was: generated list archetype. Two defects, both measured:
//   1. COLUMNS took the first six scalar fields in schema order, so `price` —
//      the whole point of this screen — was not shown at all.
//   2. "Bulk Price" fired createInventoriesBulkPrice({}) behind a window.confirm.
//      The emitter hardcoded an empty body, so it returned 422 "updates list is
//      required and must not be empty" on every click, forever. There was no UI
//      anywhere to collect the updates.
// Builder home: Road 1 A3 (columns) + A5 (an action must be able to satisfy its
// endpoint, or not be emitted).
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listInventories, listProducts, listMachines, createInventoriesBulkPrice } from '@/lib/apiClient';
import type { InventoryItemResponse, ProductResponse, MachineResponse } from '@/types/api';
import { fetchAll } from '@/lib/paginate';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';
import { fmtValue, fmtCurrency } from '@/lib/format';

type Row = InventoryItemResponse;

const errMsg = (e: unknown): string => {
  const x = e as { response?: { data?: { detail?: unknown } }; message?: string };
  const d = x?.response?.data?.detail;
  if (typeof d === 'string') return d;
  if (typeof x?.message === 'string') return x.message;
  return 'Something went wrong';
};

export default function InventoriesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<Row[]>({
    queryKey: ['inventories'],
    queryFn: () => fetchAll((q) => listInventories(q)),
  });
  const machines = useQuery<MachineResponse[]>({
    queryKey: ['machines'],
    queryFn: () => fetchAll((q) => listMachines(q)),
    staleTime: 60_000,
  });
  const products = useQuery<ProductResponse[]>({
    queryKey: ['products'],
    queryFn: () => listProducts(),
    staleTime: 60_000,
  });

  const [open, setOpen] = useState(false);
  const [machineFilter, setMachineFilter] = useState<string>('');
  const [draft, setDraft] = useState<Record<number, string>>({});

  const productName = useMemo(() => {
    const m = new Map<number, string>();
    (products.data ?? []).forEach((p) => {
      if (p.id != null) m.set(p.id, String(p.name ?? `Product ${p.id}`));
    });
    return m;
  }, [products.data]);

  const machineName = useMemo(() => {
    const m = new Map<number, string>();
    (machines.data ?? []).forEach((x) => {
      if (x.id != null) m.set(x.id, String(x.name ?? x.serial_number ?? `Machine ${x.id}`));
    });
    return m;
  }, [machines.data]);

  // A fleet's slots are meaningless ungrouped: nine machines all have a slot 1.
  const rows = useMemo(() => {
    const filtered = (data ?? []).filter(
      (r) => !machineFilter || String(r.machine_id) === machineFilter,
    );
    return [...filtered].sort((a, b) => {
      const am = machineName.get(Number(a.machine_id)) ?? '';
      const bm = machineName.get(Number(b.machine_id)) ?? '';
      return am.localeCompare(bm) || Number(a.slot_number ?? 0) - Number(b.slot_number ?? 0);
    });
  }, [data, machineFilter, machineName]);

  const bulkPrice = useMutation({
    mutationFn: (updates: { inventory_id: number; price: number }[]) =>
      createInventoriesBulkPrice({ updates }),
    onSuccess: (res: unknown) => {
      const n = (res as { updated?: number })?.updated ?? 0;
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
      toast.success(`${n} slot${n === 1 ? '' : 's'} repriced`);
      setOpen(false);
      setDraft({});
    },
    onError: (e) => toast.error(errMsg(e)),
  });

  function openModal() {
    const seed: Record<number, string> = {};
    rows.forEach((r) => { if (r.id != null) seed[r.id] = r.price != null ? String(r.price) : ''; });
    setDraft(seed);
    setOpen(true);
  }

  // Only slots whose price the operator actually changed are sent.
  const changed = rows.filter((r) => {
    if (r.id == null) return false;
    const next = (draft[r.id] ?? '').trim();
    if (next === '') return false;
    const before = r.price != null ? String(Number(r.price)) : '';
    return String(Number(next)) !== before;
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-6 text-red-600">Failed to load inventories.</div>;

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventories</h1>
        <div className="flex gap-2 items-center">
          <select
            value={machineFilter}
            onChange={(e) => setMachineFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white"
          >
            <option value="">All machines</option>
            {(machines.data ?? []).map((m) => (
              <option key={m.id} value={String(m.id)}>{m.name ?? m.serial_number}</option>
            ))}
          </select>
          <button
            onClick={openModal}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Bulk price
          </button>
          <Link to="/inventories/new" className="px-3 py-2 bg-[var(--color-brand)] text-white rounded-md text-sm font-medium">
            New
          </Link>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 text-center">
          <div className="text-sm text-gray-600">No slots configured yet.</div>
          <Link to="/inventories/new" className="mt-3 inline-block text-sm text-[var(--color-brand)] hover:underline">
            Add the first slot
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {['Machine', 'Slot', 'Product', 'Cash price', 'Qty', 'Last restocked', ''].map((h, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => {
                const cur = Number(row.current_qty ?? 0);
                const max = Number(row.max_qty ?? 0);
                const low = max > 0 && cur <= max * 0.25;
                return (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {row.machine_id != null ? (machineName.get(row.machine_id) ?? fmtValue('machine_id', row.machine_id)) : '\u2014'}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{fmtValue('slot_number', row.slot_number)}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {row.product_id != null ? (productName.get(row.product_id) ?? fmtValue('product_id', row.product_id)) : '—'}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{fmtValue('price', row.price)}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={low ? 'text-red-600 font-medium' : 'text-gray-700'}>
                        {cur} / {max || '—'}
                      </span>
                      {low && <span className="ml-2 text-xs text-red-600">low</span>}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">{fmtValue('last_restocked_at', row.last_restocked_at)}</td>
                    <td className="px-6 py-3 text-sm text-right">
                      <Link to={`/inventories/${row.id}`} className="text-[var(--color-brand)] hover:underline">View</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Bulk price</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {machineFilter ? `Pricing ${machineName.get(Number(machineFilter)) ?? 'this machine'}. ` : 'Pricing every machine. '}Blank leaves a slot unchanged.
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
              {rows.map((row) => (
                <div key={row.id} className="flex items-center gap-3">
                  <div className="w-10 text-sm font-medium text-gray-900">#{row.slot_number ?? '?'}</div>
                  <div className="flex-1 text-sm text-gray-600 truncate">
                    {row.product_id != null ? (productName.get(row.product_id) ?? `Product ${row.product_id}`) : '—'}
                  </div>
                  <div className="text-xs text-gray-400 w-16 text-right">{fmtValue('price', row.price)}</div>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                    <input
                      type="number" step="0.01" min="0"
                      value={row.id != null ? (draft[row.id] ?? '') : ''}
                      onChange={(e) => row.id != null && setDraft((d) => ({ ...d, [row.id as number]: e.target.value }))}
                      className="w-28 rounded-md border border-gray-300 pl-5 pr-2 py-1.5 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {changed.length === 0
                  ? 'No changes'
                  : `${changed.length} slot${changed.length === 1 ? '' : 's'} will change`}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setOpen(false); setDraft({}); }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  disabled={changed.length === 0 || bulkPrice.isPending}
                  onClick={() => bulkPrice.mutate(
                    changed.map((r) => ({ inventory_id: r.id as number, price: Number(draft[r.id as number]) })),
                  )}
                  className="px-3 py-2 rounded-md bg-[var(--color-brand)] text-white text-sm font-medium disabled:opacity-40"
                >
                  {bulkPrice.isPending ? 'Saving…' : `Apply${changed.length ? ` (${changed.length})` : ''}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
