/**
 * Admin Dashboard Page - Overview with statistics
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { KPICard } from '@/components/admin/KPICard';
import { DataTable } from '@/components/admin/DataTable';
import { SlideOver } from '@/components/admin/SlideOver';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { EnrollmentsChart } from '@/components/admin/EnrollmentsChart';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { FiUsers, FiBook, FiUserCheck, FiDollarSign, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';

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
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AdminDashboardContent = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [revenuePeriod, setRevenuePeriod] = useState('monthly');
  const [enrollmentsPeriod, setEnrollmentsPeriod] = useState('monthly');
  
  // Fetch dashboard stats (for KPI cards)
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminDashboardStats', revenuePeriod],
    queryFn: () => AdminService.getDashboardStats({ 
      period: revenuePeriod
    }),
    refetchOnWindowFocus: false,
  });

  // Fetch revenue analytics for Revenue Reports chart
  const { data: revenueAnalytics, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['adminRevenueAnalytics', revenuePeriod],
    queryFn: () => AdminService.getRevenueAnalytics({ period: revenuePeriod }),
    refetchOnWindowFocus: false,
  });

  // Fetch course analytics for Enrollments by Course chart
  const { data: courseAnalytics, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['adminCourseAnalytics', enrollmentsPeriod],
    queryFn: () => AdminService.getCourseAnalytics({ 
      limit: 10, 
      sortBy: 'enrollments',
      period: enrollmentsPeriod 
    }),
    refetchOnWindowFocus: false,
  });

  const stats = data || {};

  // Format revenue time series data for RevenueChart
  const formatRevenueData = () => {
    const timeSeries = revenueAnalytics?.timeSeries || [];
    
    return timeSeries.map((item) => {
      let dateLabel = item.date;
      if (revenuePeriod === 'monthly' && item.date) {
        // Format "2024-01" to "Jan"
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dateParts = item.date.split('-');
        if (dateParts.length >= 2) {
          const monthIndex = Number.parseInt(dateParts[1], 10) - 1;
          dateLabel = monthNames[monthIndex] || item.date;
        }
      } else if (revenuePeriod === 'weekly' && item.date) {
        // Format for weekly (e.g., "2024-W01" to "Week 1")
        const weekMatch = item.date.match(/W(\d+)/);
        dateLabel = weekMatch ? `Week ${weekMatch[1]}` : item.date;
      } else if (revenuePeriod === 'yearly' && item.date) {
        // Format for yearly (e.g., "2024" to "2024")
        dateLabel = item.date;
      } else if (revenuePeriod === 'daily' && item.date) {
        // Format for daily
        const dayMatch = item.date.match(/\d+/);
        dateLabel = dayMatch ? `Day ${dayMatch[0]}` : item.date;
      }

      return {
        date: dateLabel,
        revenue: item.revenue || 0,
      };
    });
  };

  // Format course data for EnrollmentsChart
  const formatEnrollmentsData = () => {
    const courses = courseAnalytics?.courses || [];
    
    return courses.map((course) => ({
      course: course.courseTitle || course.title || 'Untitled Course',
      enrollments: course.enrollments || 0,
    }));
  };

  const revenueChartData = formatRevenueData();
  const enrollmentsChartData = formatEnrollmentsData();

  // Use trend data from backend, with fallback to default values
  const trends = {
    revenue: stats.revenueTrend || { direction: 'up', value: '0%' },
    students: stats.usersTrend || { direction: 'up', value: '0%' },
    enrollments: stats.ordersTrend || { direction: 'up', value: '0%' },
    refundRate: stats.refundRateTrend || { direction: 'down', value: '0%' },
  };

  // Recent Activity Table Columns
  const recentActivityColumns = [
    { key: 'user', label: 'User', sortable: true },
    { key: 'course', label: 'Course', sortable: true },
    { key: 'action', label: 'Action', sortable: false },
    {
      key: 'timestamp',
      label: 'Timestamp',
      sortable: true,
      render: (value) => formatDate(value),
    },
  ];

  // Transform recent orders to activity format
  const recentActivity = (stats.recentOrders || []).map((order) => ({
    id: order.id,
    user: `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || order.user?.email || 'Unknown',
    course: order.product?.title || order.course?.title || 'N/A',
    action: order.status === 'completed' ? 'Completed' : order.status === 'pending' ? 'Enrolled' : order.status,
    timestamp: order.createdAt || order.updatedAt,
  }));

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

  const isLoadingCharts = isLoadingRevenue || isLoadingCourses;

  return (
    <AdminLayout>
      <div className="max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm">Overview of your platform statistics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue || 0)}
            trend={trends.revenue.direction}
            trendValue={trends.revenue.value}
            icon={FiDollarSign}
            color="blue"
          />
          <KPICard
            title="Active Students"
            value={stats.totalUsers || 0}
            trend={trends.students.direction}
            trendValue={trends.students.value}
            icon={FiUsers}
            color="pink"
          />
          <KPICard
            title="Enrollments"
            value={stats.totalOrders || 0}
            trend={trends.enrollments.direction}
            trendValue={trends.enrollments.value}
            icon={FiTrendingUp}
            color="green"
          />
          <KPICard
            title="Refund Rate"
            value={`${stats.refundRate || 0}%`}
            trend={trends.refundRate.direction}
            trendValue={trends.refundRate.value}
            icon={FiShoppingCart}
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Revenue Reports</h3>
                <p className="text-sm text-gray-400">Revenue reports graph</p>
              </div>
              <select 
                value={revenuePeriod}
                onChange={(e) => setRevenuePeriod(e.target.value)}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            {isLoadingRevenue ? (
              <div className="flex items-center justify-center h-[300px]">
                <LoadingSpinner />
              </div>
            ) : (
              <RevenueChart data={revenueChartData} />
            )}
          </div>
          <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Enrollments by Course</h3>
                <p className="text-sm text-gray-400">Course enrollment statistics</p>
              </div>
              <select 
                value={enrollmentsPeriod}
                onChange={(e) => setEnrollmentsPeriod(e.target.value)}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            {isLoadingCourses ? (
              <div className="flex items-center justify-center h-[300px]">
                <LoadingSpinner />
              </div>
            ) : (
              <EnrollmentsChart data={enrollmentsChartData} />
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to={ROUTES.ADMIN.USERS}
            className="inline-flex items-center justify-center gap-3 bg-gray-50/50 text-gray-700 hover:bg-gray-100/70 border-2 border-gray-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_6px_8px_rgba(0,0,0,0.15),0_4px_6px_rgba(0,0,0,0.1)] focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium rounded-lg px-6 py-3 text-base transition-all duration-200 focus:outline-none transform hover:-translate-y-0.5"
          >
            <FiUsers size={20} className="text-gray-600" />
            <div className="text-left">
              <div className="font-semibold">Manage Users</div>
              <div className="text-xs text-gray-500">View and edit users</div>
            </div>
          </Link>

          <Link
            to={ROUTES.ADMIN.COURSES}
            className="inline-flex items-center justify-center gap-3 bg-gray-50/50 text-gray-700 hover:bg-gray-100/70 border-2 border-gray-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_6px_8px_rgba(0,0,0,0.15),0_4px_6px_rgba(0,0,0,0.1)] focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium rounded-lg px-6 py-3 text-base transition-all duration-200 focus:outline-none transform hover:-translate-y-0.5"
          >
            <FiBook size={20} className="text-gray-600" />
            <div className="text-left">
              <div className="font-semibold">Manage Courses</div>
              <div className="text-xs text-gray-500">Create and edit courses</div>
            </div>
          </Link>

          <Link
            to={ROUTES.ADMIN.INSTRUCTORS}
            className="inline-flex items-center justify-center gap-3 bg-gray-50/50 text-gray-700 hover:bg-gray-100/70 border-2 border-gray-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_6px_8px_rgba(0,0,0,0.15),0_4px_6px_rgba(0,0,0,0.1)] focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium rounded-lg px-6 py-3 text-base transition-all duration-200 focus:outline-none transform hover:-translate-y-0.5"
          >
            <FiUserCheck size={20} className="text-gray-600" />
            <div className="text-left">
              <div className="font-semibold">Manage Instructors</div>
              <div className="text-xs text-gray-500">Add and edit instructors</div>
            </div>
          </Link>

          <Link
            to={ROUTES.ADMIN.ORDERS}
            className="inline-flex items-center justify-center gap-3 bg-gray-50/50 text-gray-700 hover:bg-gray-100/70 border-2 border-gray-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_6px_8px_rgba(0,0,0,0.15),0_4px_6px_rgba(0,0,0,0.1)] focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium rounded-lg px-6 py-3 text-base transition-all duration-200 focus:outline-none transform hover:-translate-y-0.5"
          >
            <FiShoppingCart size={20} className="text-gray-600" />
            <div className="text-left">
              <div className="font-semibold">Manage Orders</div>
              <div className="text-xs text-gray-500">View and update orders</div>
            </div>
          </Link>
        </div>

        {/* Recent Activity Table */}
        <div className="mb-8">
          <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Recent Transactions</h2>
                <p className="text-sm text-gray-400">Recent activity and orders</p>
              </div>
              <div className="flex items-center gap-3">
                <select className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
                <Link
                  to={ROUTES.ADMIN.ORDERS}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Course</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <tr
                        key={activity.id}
                        onClick={() => {
                          const order = stats.recentOrders?.find((o) => o.id === activity.id);
                          if (order) setSelectedOrder(order);
                        }}
                        className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {activity.user?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <span className="text-white font-medium">{activity.user}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{activity.course}</td>
                        <td className="py-4 px-4">
                          <span className="text-red-400 font-semibold">
                            {formatCurrency(
                              stats.recentOrders?.find((o) => o.id === activity.id)?.totalAmount || 0
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            activity.action === 'Completed'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {activity.action}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-400 text-sm">{activity.timestamp}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No recent activity
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Detail Slide Over */}
        {selectedOrder && (
          <SlideOver
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            title={`Order #${selectedOrder.id}`}
            size="md"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">User</h3>
                <p className="text-font-primary">
                  {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                </p>
                <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Course</h3>
                <p className="text-font-primary">
                  {selectedOrder.product?.title || selectedOrder.course?.title || 'N/A'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Amount</h3>
                <p className="text-2xl font-bold text-font-primary">
                  {formatCurrency(selectedOrder.totalAmount || selectedOrder.amount)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Status</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                  selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Created: {formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  {selectedOrder.updatedAt && selectedOrder.updatedAt !== selectedOrder.createdAt && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Updated: {formatDate(selectedOrder.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SlideOver>
        )}
      </div>
    </AdminLayout>
  );
};

export const AdminDashboardPage = () => {
  return <AdminDashboardContent />;
};

export default AdminDashboardPage;

