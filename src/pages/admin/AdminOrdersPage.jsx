/**
 * Admin Orders Management Page
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SlideOver } from '@/components/admin/SlideOver';
import { DataTable } from '@/components/admin/DataTable';
import { FiSearch, FiDownload, FiRefreshCw } from 'react-icons/fi';

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

  const refundMutation = useMutation({
    mutationFn: ({ id, notes }) => AdminService.updateOrderStatus(id, { status: 'refunded', notes }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrders']);
      setSelectedOrder(null);
      alert('Order refunded successfully');
    },
    onError: (error) => {
      alert(`Failed to refund order: ${error.message}`);
    },
  });

  const orders = data?.data?.orders || data?.orders || [];
  const pagination = data?.data?.pagination || data?.pagination || {};

  const handleStatusUpdate = (orderId, newStatus) => {
    updateStatusMutation.mutate({
      id: orderId,
      statusData: { status: newStatus },
    });
  };

  const handleRefund = (order, refundNotes) => {
    if (window.confirm(`Are you sure you want to refund order #${order.id}?`)) {
      refundMutation.mutate({
        id: order.id,
        notes: refundNotes || 'Refund processed by admin',
      });
    }
  };

  const handleDownloadInvoice = (order) => {
    // Generate and download invoice
    const invoiceContent = `
      INVOICE
      Order #${order.id}
      Date: ${formatDate(order.createdAt)}
      
      Customer: ${order.user?.firstName} ${order.user?.lastName}
      Email: ${order.user?.email}
      
      Course: ${order.product?.title || order.course?.title || 'N/A'}
      Amount: ${formatCurrency(order.totalAmount || order.amount)}
      Status: ${order.status}
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const orderColumns = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (value) => `#${value}`,
    },
    {
      key: 'user',
      label: 'User',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-medium">
            {row.user?.firstName} {row.user?.lastName}
          </div>
          <div className="text-sm text-gray-600">{row.user?.email}</div>
        </div>
      ),
    },
    {
      key: 'course',
      label: 'Course',
      sortable: true,
      render: (_, row) => row.product?.title || row.course?.title || 'N/A',
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (_, row) => formatCurrency(row.totalAmount || row.amount),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'completed' ? 'bg-green-100 text-green-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'cancelled' ? 'bg-red-100 text-red-800' :
          value === 'refunded' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (_, row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedOrder(row)}
            className="bg-primary rounded-[50px] text-white cursor-pointer text-xs py-1.5 px-4
              transition-all duration-200 ease-in-out border-2 border-primary/80
              shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.1)]
              hover:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.15),1px_1px_3px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)]
              focus:outline-none focus:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.15),1px_1px_3px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)]"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Order Management</h1>
          <p className="text-gray-400 text-sm">View and manage all orders</p>
        </div>

        {/* Filters */}
        <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search orders..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
        <DataTable
          columns={orderColumns}
          data={orders}
          pagination={pagination}
          onPageChange={(page) => setFilters({ ...filters, page })}
          emptyMessage="No orders found"
        />

        {/* Order Detail Slide Over */}
        {selectedOrder && (
          <SlideOver
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            title={`Order #${selectedOrder.id}`}
            size="md"
          >
            <div className="space-y-6">
              {/* Order Timeline */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-3">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-font-primary">Order Created</p>
                      <p className="text-xs text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </div>
                  {selectedOrder.status === 'completed' && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-font-primary">Payment Completed</p>
                        <p className="text-xs text-gray-600">{formatDate(selectedOrder.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'refunded' && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-font-primary">Refunded</p>
                        <p className="text-xs text-gray-600">{formatDate(selectedOrder.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Customer</h3>
                <p className="text-font-primary font-medium">
                  {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                </p>
                <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
              </div>

              {/* Course Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Course</h3>
                <p className="text-font-primary font-medium">
                  {selectedOrder.product?.title || selectedOrder.course?.title || 'N/A'}
                </p>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Payment</h3>
                <p className="text-2xl font-bold text-font-primary">
                  {formatCurrency(selectedOrder.totalAmount || selectedOrder.amount)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Status: <span className="font-medium">{selectedOrder.status}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stroke space-y-3">
                <button
                  onClick={() => handleDownloadInvoice(selectedOrder)}
                  className="w-full bg-primary rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                    transition-all duration-200 ease-in-out border-2 border-primary/80
                    shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                    hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                    focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                >
                  <FiDownload size={18} />
                  <span>Download Invoice</span>
                </button>
                {selectedOrder.status !== 'refunded' && (
                  <button
                    onClick={() => {
                      const notes = window.prompt('Enter refund notes (optional):');
                      if (notes !== null) {
                        handleRefund(selectedOrder, notes);
                      }
                    }}
                    className="w-full bg-red-600 rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                      transition-all duration-200 ease-in-out border-2 border-red-700/80
                      shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                      hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                      focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 disabled:opacity-50"
                    disabled={refundMutation.isPending}
                  >
                    <FiRefreshCw size={18} />
                    <span>{refundMutation.isPending ? 'Processing...' : 'Process Refund'}</span>
                  </button>
                )}
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                  className="w-full px-4 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={updateStatusMutation.isPending}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </SlideOver>
        )}
      </div>
    </AdminLayout>
  );
};

export const AdminOrdersPage = () => {
  return <AdminOrdersContent />;
};

export default AdminOrdersPage;

