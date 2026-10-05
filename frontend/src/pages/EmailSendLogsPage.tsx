// JARVIS App — EmailSendLogsPage (CONTRACT-FIRST list archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listEmailSendLogs } from '@/lib/apiClient';
import type { EmailSendLogResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Row = EmailSendLogResponse;
type Col = { key: string; label: string; render: (row: Row) => string };

const COLUMNS: Col[] = [
  { key: "lead_id", label: "Lead", render: (row) => fmtValue("lead_id", row.lead_id) },
  { key: "sequence_id", label: "Sequence Id", render: (row) => fmtValue("sequence_id", row.sequence_id) },
  { key: "step_number", label: "Step Number", render: (row) => fmtValue("step_number", row.step_number) },
  { key: "subject", label: "Subject", render: (row) => fmtValue("subject", row.subject) },
  { key: "status", label: "Status", render: (row) => fmtValue("status", row.status) },
];

export default function EmailSendLogsPage() {
  const refLabel = useRefLabels(COLUMNS.map((c: Col) => c.key));   // S204: parents by name
  const { data, isLoading, error } = useQuery({
    queryKey: ["email_send_logs"],
    queryFn: () => listEmailSendLogs(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Email Send Logs</div>;

  const items: Row[] = data ?? [];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email Send Logs</h1>
        <Link to="/email-send-logs/new" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">New</Link>
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
                    {refLabel(col.key, (row as Record<string, unknown>)[col.key]) ?? col.render(row)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link to={`/email-send-logs/${row.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
