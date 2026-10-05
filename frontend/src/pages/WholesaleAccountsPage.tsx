// JARVIS App — WholesaleAccountsPage (CONTRACT-FIRST list archetype, generated). DO NOT EDIT BY HAND.
// Generated deterministically by frontend_codegen.py v1.33.0 (emit_pages).
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listWholesaleAccounts } from '@/lib/apiClient';
import type { WholesaleAccountResponse } from '@/types/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fmtValue } from '@/lib/format';

type Row = WholesaleAccountResponse;
type Col = { key: string; label: string; render: (row: Row) => string };

const COLUMNS: Col[] = [
  { key: "id", label: "ID", render: (row) => fmtValue("id", row.id) },
  { key: "business_name", label: "Business Name", render: (row) => fmtValue("business_name", row.business_name) },
  { key: "contact_name", label: "Contact Name", render: (row) => fmtValue("contact_name", row.contact_name) },
  { key: "contact_email", label: "Contact Email", render: (row) => fmtValue("contact_email", row.contact_email) },
  { key: "contact_phone", label: "Contact Phone", render: (row) => fmtValue("contact_phone", row.contact_phone) },
  { key: "address", label: "Address", render: (row) => fmtValue("address", row.address) },
];

export default function WholesaleAccountsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["wholesale_accounts"],
    queryFn: () => listWholesaleAccounts(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-600">Error loading Wholesale Accounts</div>;

  const items: Row[] = data ?? [];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Wholesale Accounts</h1>
        <Link to="/wholesale-accounts/new" className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">New</Link>
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
                  <Link to={`/wholesale-accounts/${row.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
