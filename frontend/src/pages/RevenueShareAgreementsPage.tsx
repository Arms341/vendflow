// JARVIS App — RevenueShareAgreementsPage (CONTRACT-FIRST list archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listRevenueShareAgreements } from '@/lib/apiClient';
import type { RevenueShareAgreementResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';

type Row = RevenueShareAgreementResponse;
type Col = { key: string; label: string; render: (row: Row) => string };

const COLUMNS: Col[] = [
  { key: "id", label: "ID", render: (row) => fmtValue("id", row.id) },
  { key: "operator_id", label: "Operator Id", render: (row) => fmtValue("operator_id", row.operator_id) },
  { key: "landowner_id", label: "Landowner Id", render: (row) => fmtValue("landowner_id", row.landowner_id) },
  { key: "location_id", label: "Location Id", render: (row) => fmtValue("location_id", row.location_id) },
  { key: "machine_id", label: "Machine Id", render: (row) => fmtValue("machine_id", row.machine_id) },
  { key: "share_type", label: "Share Type", render: (row) => fmtValue("share_type", row.share_type) },
];

export default function RevenueShareAgreementsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["revenue_share_agreements"],
    queryFn: () => listRevenueShareAgreements(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Revenue Share Agreements</div>;

  const items: Row[] = data ?? [];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Revenue Share Agreements</h1>
        <Link to="/revenue-share-agreements/new" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">New</Link>
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
                  <Link to={`/revenue-share-agreements/${row.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
