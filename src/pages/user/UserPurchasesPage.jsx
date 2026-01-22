/**
 * User Purchases Page
 */

import { useQuery } from '@tanstack/react-query';
import { UserLayout } from '@/components/user/UserLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { StudentService } from '@/services';
import { FiShoppingBag } from 'react-icons/fi';

const formatCurrency = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount || 0);
  } catch {
    return `$${amount || 0}`;
  }
};

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString || 'N/A';
  }
};

const UserPurchasesContent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['studentEnrollments'],
    queryFn: () => StudentService.getEnrollments(),
  });

  const enrollments = data?.enrollments || [];

  return (
    <UserLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-font-primary">My Purchases</h1>
          <p className="text-gray-600 mt-2">View your purchase history</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-stroke p-8">
            <ErrorMessage
              message={
                error.status === 500
                  ? 'Server error. Please try again later or contact support if the problem persists.'
                  : error.message || 'Failed to load your purchases'
              }
              className="mb-4"
            />
            {error.status === 500 && (
              <div className="mt-4 text-sm text-gray-600">
                <p>If this problem continues, please:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Refresh the page</li>
                  <li>Check your internet connection</li>
                  <li>Contact support if the issue persists</li>
                </ul>
              </div>
            )}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-stroke p-12 text-center">
            <FiShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-font-primary mb-2">No purchases yet</h2>
            <p className="text-gray-600">You haven't made any purchases yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-stroke overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-stroke">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-stroke">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-font-primary">
                          {enrollment.course?.title || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {formatDate(enrollment.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-font-primary">
                          {formatCurrency(enrollment.order?.amount, enrollment.order?.currency)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          enrollment.order?.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : enrollment.order?.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {enrollment.order?.status || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export const UserPurchasesPage = () => {
  return (
    <ProtectedRoute>
      <UserPurchasesContent />
    </ProtectedRoute>
  );
};

export default UserPurchasesPage;
