import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/index';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function UserManagement() {
  const { data, isLoading, isError } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => api.get('/users/').then((r) => r.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data) return <div className="p-6 text-red-600">Failed to load users</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Users</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user: any) => (
              <tr key={user.id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium text-gray-900">{user.id}</td>
                <td className="px-4 py-2 text-gray-600">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}