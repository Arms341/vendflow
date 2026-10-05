// JARVIS App — LeadPipeline (CONTRACT-FIRST board archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_board_page).
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listLeads, updateLeads } from '@/lib/apiClient';
import type { LeadResponse, LeadUpdate } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';

type Card = LeadResponse;
const UNASSIGNED = 'Unassigned';

export default function LeadPipeline() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["leads"],
    queryFn: () => listLeads(),
  });

  const updateStatus = useMutation({
    mutationFn: (vars: { id: number; status: string }) =>
      updateLeads(vars.id, { status: vars.status } as LeadUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const items: Card[] = data ?? [];

  const columns = useMemo(() => {
    const set = new Set<string>();
    let hasUnassigned = false;
    for (const c of items) {
      const s = String(c.status ?? '');
      if (s) set.add(s);
      else hasUnassigned = true;
    }
    const cols = Array.from(set).sort();
    if (hasUnassigned) cols.push(UNASSIGNED);
    return cols;
  }, [items]);

  const statusOptions = useMemo(
    () => columns.filter((c: string) => c !== UNASSIGNED),
    [columns],
  );

  const grouped = useMemo(() => {
    const g: Record<string, Card[]> = {};
    for (const col of columns) g[col] = [];
    for (const c of items) {
      const key = String(c.status ?? '') || UNASSIGNED;
      if (!g[key]) g[key] = [];
      g[key].push(c);
    }
    return g;
  }, [items, columns]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Lead Pipeline</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Pipeline</h1>
          <p className="mt-1 text-sm text-gray-500">{"CRM kanban-style lead pipeline: view leads by status, add notes, schedule follow-ups, trigger proposals"}</p>
        </div>
        <Link to="/leads/new" className="shrink-0 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">New</Link>
      </div>
      {columns.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          Nothing here yet. Click “New” to create the first record.
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col: string) => (
            <div key={col} className="flex-shrink-0 w-72 bg-gray-50 rounded-lg border border-gray-200">
              <div className="px-3 py-2 border-b border-gray-200 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">{col}</span>
                <span className="text-xs text-gray-400">{(grouped[col] ?? []).length}</span>
              </div>
              <div className="p-2 space-y-2">
                {(grouped[col] ?? []).map((card: Card) => (
                  <div key={card.id} className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
                    <div className="font-medium text-sm text-gray-900">{String(card.operator_id ?? '')}</div>
                    <div className="text-xs text-gray-500">{String(card.business_name ?? '')}</div>
                    <div className="text-xs text-gray-500">{String(card.contact_name ?? '')}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <select
                        value={String(card.status ?? '')}
                        onChange={(e) => updateStatus.mutate({ id: card.id, status: e.target.value })}
                        disabled={updateStatus.isPending}
                        className="text-xs border border-gray-300 rounded px-1 py-0.5"
                      >
                        {statusOptions.map((s: string) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Link to={`/leads/${card.id}/edit`} className="text-xs text-blue-600 hover:underline">Edit</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
