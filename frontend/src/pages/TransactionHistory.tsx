import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Transaction } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

function formatMoney(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') return '$0.00';
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  if (Number.isNaN(n)) return '$0.00';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  
  const { data, isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => api.get('/transactions/').then((r) => r.data),
  });

  const filteredTransactions = useMemo(() => {
    if (!data) return [];
    
    return data.filter((transaction: any) => {
      const matchesSearch = 
        (transaction.id?.toString().includes(searchTerm)) ||
        (transaction.machine_id?.toString().includes(searchTerm)) ||
        (transaction.payment_method?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.payment_status?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.payment_ref?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.card_brand?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transaction.card_last_four?.includes(searchTerm));
      
      const matchesStatus = 
        paymentStatusFilter === 'all' || 
        transaction.payment_status?.toLowerCase() === paymentStatusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, paymentStatusFilter]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="p-6 text-red-600">Failed to load transactions</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search transactions..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction: any) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.machine_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatMoney(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.payment_method || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${transaction.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 
                          transaction.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          transaction.payment_status === 'failed' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {transaction.payment_status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}