// JARVIS App — MarketingDashboard (CONTRACT-FIRST dashboard archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_dashboard_page).
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { listEmailSendLogs, listEmailSequences, listLeads, listProposals } from '@/lib/apiClient';
import type { EmailSendLogResponse, EmailSequenceResponse, LeadResponse, ProposalResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue, fmtCurrency } from '@/lib/format';
import { useRefLabels } from '@/lib/useRefLabels';

type ChartDatum = { name: string; count: number };

export default function MarketingDashboard() {
  const refLabel = useRefLabels(["lead_id", "operator_id"]);   // S204: parents by name
  const { data: emailSendLogsData, isLoading: emailSendLogsLoading } = useQuery<EmailSendLogResponse[]>({
    queryKey: ["email_send_logs"],
    queryFn: () => listEmailSendLogs(),
  });
  const { data: emailSequencesData, isLoading: emailSequencesLoading } = useQuery<EmailSequenceResponse[]>({
    queryKey: ["email_sequences"],
    queryFn: () => listEmailSequences(),
  });
  const { data: leadsData, isLoading: leadsLoading } = useQuery<LeadResponse[]>({
    queryKey: ["leads"],
    queryFn: () => listLeads(),
  });
  const { data: proposalsData, isLoading: proposalsLoading } = useQuery<ProposalResponse[]>({
    queryKey: ["proposals"],
    queryFn: () => listProposals(),
  });

  const isLoading = emailSendLogsLoading || emailSequencesLoading || leadsLoading || proposalsLoading;
  if (isLoading) return <LoadingSpinner />;

  const proposalsCount: number = (proposalsData ?? []).length;
  const emailSendLogsCount: number = (emailSendLogsData ?? []).length;
  const emailSequencesCount: number = (emailSequencesData ?? []).length;
  const leadsCount: number = (leadsData ?? []).length;
  const sum0: number = (proposalsData ?? []).reduce((acc: number, r: ProposalResponse) => acc + Number(r.monthly_revenue_estimate ?? 0), 0);
  const sum1: number = (proposalsData ?? []).reduce((acc: number, r: ProposalResponse) => acc + Number(r.placement_fee ?? 0), 0);
  const recentRows: ProposalResponse[] = [...(proposalsData ?? [])].sort((a: ProposalResponse, b: ProposalResponse) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 8);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Marketing</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Proposals</div>
          <div className="text-2xl font-bold">{proposalsCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Email Send Logs</div>
          <div className="text-2xl font-bold">{emailSendLogsCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Email Sequences</div>
          <div className="text-2xl font-bold">{emailSequencesCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Leads</div>
          <div className="text-2xl font-bold">{leadsCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Monthly Revenue Estimate</div>
          <div className="text-2xl font-bold">{fmtCurrency(sum0)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Placement Fee</div>
          <div className="text-2xl font-bold">{fmtCurrency(sum1)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Proposals</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Machine Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentRows.map((row: ProposalResponse) => (
                <tr key={row.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{refLabel("lead_id", row.lead_id) ?? fmtValue("lead_id", row.lead_id)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{refLabel("operator_id", row.operator_id) ?? fmtValue("operator_id", row.operator_id)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{fmtValue("title", row.title)}</td>
                  <td className="px-4 py-2 max-w-xs truncate text-sm text-gray-900">{fmtValue("description", row.description)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{fmtValue("machine_type", row.machine_type)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
