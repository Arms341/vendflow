// JARVIS App — EmailSendLogsDetailPage (CONTRACT-FIRST detail archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEmailSendLogs, deleteEmailSendLogs } from '@/lib/apiClient';
import type { EmailSendLogResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type Field = { key: string; label: string; render: (r: EmailSendLogResponse) => string };

const FIELDS: Field[] = [
  { key: "id", label: "ID", render: (r) => fmtValue("id", r.id) },
  { key: "lead_id", label: "Lead Id", render: (r) => fmtValue("lead_id", r.lead_id) },
  { key: "sequence_id", label: "Sequence Id", render: (r) => fmtValue("sequence_id", r.sequence_id) },
  { key: "step_number", label: "Step Number", render: (r) => fmtValue("step_number", r.step_number) },
  { key: "subject", label: "Subject", render: (r) => fmtValue("subject", r.subject) },
  { key: "status", label: "Status", render: (r) => fmtValue("status", r.status) },
  { key: "sent_at", label: "Sent At", render: (r) => fmtValue("sent_at", r.sent_at) },
  { key: "opened_at", label: "Opened At", render: (r) => fmtValue("opened_at", r.opened_at) },
  { key: "clicked_at", label: "Clicked At", render: (r) => fmtValue("clicked_at", r.clicked_at) },
  { key: "created_at", label: "Created At", render: (r) => fmtValue("created_at", r.created_at) },
  { key: "updated_at", label: "Updated At", render: (r) => fmtValue("updated_at", r.updated_at) },
];

export default function EmailSendLogsDetailPage() {
  const refLabel = useRefLabels(FIELDS.map((f) => f.key));
  const { id } = useParams<{ id: string }>();
  const recordId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: () => deleteEmailSendLogs(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email_send_logs"] });
      navigate("/email-send-logs");
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["email_send_logs", recordId],
    queryFn: () => getEmailSendLogs(recordId),
    enabled: Number.isFinite(recordId),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Email Send Logs</div>;
  if (!data) return <div className="p-6 text-gray-600">Not found</div>;

  const record: EmailSendLogResponse = data;

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Email Send Logs #{String(record.id ?? '')}</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/email-send-logs" className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium">Back</Link>
          <Link to={`/email-send-logs/${String(record.id ?? '')}/edit`} className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium">Edit</Link>
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
