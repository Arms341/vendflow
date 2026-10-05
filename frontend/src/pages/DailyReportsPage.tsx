// JARVIS App — DailyReportsPage (CONTRACT-FIRST list archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listDailyReports } from '@/lib/apiClient';
import type { DailyReportResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchAll } from '@/lib/paginate';
import { fmtValue } from '@/lib/format';

type Row = DailyReportResponse;
type Col = { key: string; label: string; render: (row: Row) => string };

const COLUMNS: Col[] = [
  { key: "id", label: "ID", render: (row) => fmtValue("id", row.id) },
  { key: "machine_id", label: "Machine Id", render: (row) => fmtValue("machine_id", row.machine_id) },
  { key: "report_date", label: "Report Date", render: (row) => fmtValue("report_date", row.report_date) },
  { key: "total_transactions", label: "Total Transactions", render: (row) => fmtValue("total_transactions", row.total_transactions) },
  { key: "total_revenue", label: "Total Revenue", render: (row) => fmtValue("total_revenue", row.total_revenue) },
  { key: "card_revenue", label: "Card Revenue", render: (row) => fmtValue("card_revenue", row.card_revenue) },
];

export default function DailyReportsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["daily_reports"],
    queryFn: () => fetchAll((q) => listDailyReports(q)),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Daily Reports</div>;

  const items: Row[] = data ?? [];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Daily Reports</h1>
        <Link to="/daily-reports/new" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">New</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {COLUMNS.map((col: Col) => (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="px-6 py-14 text-center">
                  <div className="text-sm text-gray-600">Nothing here yet.</div>
                  <div className="text-xs text-gray-400 mt-1">Records will appear as soon as there are some.</div>
                </td>
              </tr>
            )}
            {items.map((row: Row) => (
              <tr key={row.id}>
                {COLUMNS.map((col: Col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {col.render(row)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link to={`/daily-reports/${row.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
