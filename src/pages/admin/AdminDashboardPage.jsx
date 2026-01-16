/**
 * Admin Dashboard Page - Overview with statistics
 */

import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AdminRoute } from '@/components/common/AdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { FiUsers, FiBook, FiUserCheck, FiDollarSign, FiShoppingCart } from 'react-icons/fi';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary-dark text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-600 text-white',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stroke p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-3xl font-bold text-font-primary">{value}</div>
    </div>
  );
};

const AdminDashboardContent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => AdminService.getDashboardStats(),
  });

  const stats = data || {};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <ErrorMessage
          message={error.message || 'Failed to load dashboard statistics'}
          className="max-w-2xl"
        />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-font-primary mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your platform statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers || 0}
            icon={FiUsers}
            color="primary"
          />
          <StatCard
            title="Total Courses"
            value={stats.totalCourses || 0}
            icon={FiBook}
            color="info"
          />
          <StatCard
            title="Instructors"
            value={stats.totalInstructors || 0}
            icon={FiUserCheck}
            color="success"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders || 0}
            icon={FiShoppingCart}
            color="warning"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={FiDollarSign}
            color="secondary"
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to={ROUTES.ADMIN.USERS}
            className="bg-white rounded-xl shadow-sm border border-stroke p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <FiUsers className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-font-primary">Manage Users</h3>
                <p className="text-sm text-gray-600">View and edit users</p>
              </div>
            </div>
          </Link>

          <Link
            to={ROUTES.ADMIN.COURSES}
            className="bg-white rounded-xl shadow-sm border border-stroke p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FiBook className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-font-primary">Manage Courses</h3>
                <p className="text-sm text-gray-600">Create and edit courses</p>
              </div>
            </div>
          </Link>

          <Link
            to={ROUTES.ADMIN.INSTRUCTORS}
            className="bg-white rounded-xl shadow-sm border border-stroke p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FiUserCheck className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-font-primary">Manage Instructors</h3>
                <p className="text-sm text-gray-600">Add and edit instructors</p>
              </div>
            </div>
          </Link>

          <Link
            to={ROUTES.ADMIN.ORDERS}
            className="bg-white rounded-xl shadow-sm border border-stroke p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FiShoppingCart className="text-yellow-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-font-primary">Manage Orders</h3>
                <p className="text-sm text-gray-600">View and update orders</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        {stats.recentOrders && stats.recentOrders.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-stroke p-6">
            <h2 className="text-2xl font-bold text-font-primary mb-6">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stroke">
                    <th className="text-left py-3 px-4 font-semibold text-font-primary">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-font-primary">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-font-primary">Course</th>
                    <th className="text-left py-3 px-4 font-semibold text-font-primary">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-font-primary">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-stroke">
                      <td className="py-3 px-4 text-gray-600">#{order.id}</td>
                      <td className="py-3 px-4 text-font-primary">
                        {order.user?.firstName} {order.user?.lastName}
                      </td>
                      <td className="py-3 px-4 text-font-primary">
                        {order.product?.title || order.course?.title || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-font-primary">
                        {formatCurrency(order.totalAmount || order.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
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
    </AdminLayout>
  );
};

export const AdminDashboardPage = () => {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
};

export default AdminDashboardPage;

