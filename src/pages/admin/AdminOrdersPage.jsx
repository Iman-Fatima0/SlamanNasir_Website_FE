/**
 * Admin Orders Management Page
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AdminRoute } from '@/components/common/AdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const AdminOrdersContent = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: '',
  });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminOrders', filters],
    queryFn: () => AdminService.getOrders(filters),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, statusData }) => AdminService.updateOrderStatus(id, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrders']);
      setSelectedOrder(null);
    },
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination || {};

  const handleStatusUpdate = (orderId, newStatus) => {
    updateStatusMutation.mutate({
      id: orderId,
      statusData: { status: newStatus },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-font-primary mb-2">Order Management</h1>
          <p className="text-gray-600">View and manage all orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-stroke p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full pl-10 pr-4 py-2 border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {error && (
          <ErrorMessage
            message={error.message || 'Failed to load orders'}
            className="mb-6"
          />
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-stroke overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-font-primary">Order ID</th>
                  <th className="text-left py-3 px-6 font-semibold text-font-primary">User</th>
                  <th className="text-left py-3 px-6 font-semibold text-font-primary">Course</th>
                  <th className="text-left py-3 px-6 font-semibold text-font-primary">Amount</th>
                  <th className="text-left py-3 px-6 font-semibold text-font-primary">Status</th>
                  <th className="text-left py-3 px-6 font-semibold text-font-primary">Date</th>
                  <th className="text-left py-3 px-6 font-semibold text-font-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-stroke hover:bg-gray-50">
                    <td className="py-4 px-6 text-gray-600">#{order.id}</td>
                    <td className="py-4 px-6 text-font-primary">
                      {order.user?.firstName} {order.user?.lastName}
                      <div className="text-sm text-gray-600">{order.user?.email}</div>
                    </td>
                    <td className="py-4 px-6 text-font-primary">
                      {order.product?.title || order.course?.title || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-font-primary font-semibold">
                      {formatCurrency(order.totalAmount || order.amount)}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                        disabled={updateStatusMutation.isLoading}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary hover:text-primary-dark"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-stroke flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 border border-stroke rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border border-stroke rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminOrdersPage = () => {
  return (
    <AdminRoute>
      <AdminOrdersContent />
    </AdminRoute>
  );
};

export default AdminOrdersPage;

