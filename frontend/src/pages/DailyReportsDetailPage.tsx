// JARVIS App — DailyReportsDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDailyReports, deleteDailyReports } from '@/lib/apiClient';
import type { DailyReportResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Field = { key: string; label: string; render: (r: DailyReportResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "machine_id", label: "Machine Id", render: (r) => fmtValue("machine_id", r.machine_id) },
  { key: "report_date", label: "Report Date", render: (r) => fmtValue("report_date", r.report_date) },
  { key: "total_transactions", label: "Total Transactions", render: (r) => fmtValue("total_transactions", r.total_transactions) },
  { key: "total_revenue", label: "Total Revenue", render: (r) => fmtValue("total_revenue", r.total_revenue) },
  { key: "card_revenue", label: "Card Revenue", render: (r) => fmtValue("card_revenue", r.card_revenue) },
  { key: "cash_revenue", label: "Cash Revenue", render: (r) => fmtValue("cash_revenue", r.cash_revenue) },
  { key: "items_sold", label: "Items Sold", render: (r) => fmtValue("items_sold", r.items_sold) },
  { key: "avg_transaction", label: "Avg Transaction", render: (r) => fmtValue("avg_transaction", r.avg_transaction) },
  { key: "uptime_hours", label: "Uptime Hours", render: (r) => fmtValue("uptime_hours", r.uptime_hours) },
  { key: "alerts_count", label: "Alerts Count", render: (r) => fmtValue("alerts_count", r.alerts_count) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
];

export default function DailyReportsDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteDailyReports(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_reports"] });
      navigate("/daily-reports");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["daily_reports", recordId],
    queryFn: () => getDailyReports(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Daily Reports</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: DailyReportResponse = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Daily Reports #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/daily-reports" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/daily-reports/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
          <button onClick={() => { if (window.confirm('Delete this record?')) del.mutate(); }} disabled={del.isPending} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium disabled:opacity-50">{del.isPending ? 'Deleting\u2026' : 'Delete'}</button>
        </div>
      </div>
      <dl className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {FIELDS.map((f: Field) => (
          <div key={f.key} className="grid grid-cols-5 md:grid-cols-3 gap-3 md:gap-4 px-4 md:px-6 py-3">
            <dt className="col-span-2 md:col-span-1 min-w-0 break-words text-sm font-medium text-gray-500">
              {f.key.endsWith('_id') && f.key !== 'id' ? f.label.replace(/ Id$/, '') : f.label}
            </dt>
            <dd className="col-span-3 md:col-span-2 min-w-0 text-sm text-gray-900 break-words">
              {(f.key.endsWith('_id') && f.key !== 'id'
                ? refLabel(f.key, (record as Record<string, unknown>)[f.key])
                : null) ?? f.render(record)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
