/**
 * Admin User Profile Page
 * Detailed view of a student with activity tracking
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { DataTable } from '@/components/admin/DataTable';
import { ROUTES } from '@/constants';
import {
  FiArrowLeft,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiBook,
  FiEdit,
} from 'react-icons/fi';

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

const AdminUserProfileContent = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminUser', id],
    queryFn: () => AdminService.getUserById(id),
  });

  const user = data?.data?.user || {};

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
          message={error.message || 'Failed to load user details'}
          className="max-w-2xl"
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'Courses' },
    { id: 'payments', label: 'Payments' },
    { id: 'activity', label: 'Activity' },
    { id: 'notes', label: 'Notes' },
  ];

  // Mock data - replace with actual API calls
  const userCourses = [];
  const userPayments = [];
  const userActivity = [];

  const coursesColumns = [
    { key: 'title', label: 'Course', sortable: true },
    { key: 'progress', label: 'Progress', sortable: true, render: (value) => `${value || 0}%` },
    { key: 'enrolledDate', label: 'Enrolled', sortable: true, render: (value) => formatDate(value) },
    { key: 'status', label: 'Status', sortable: false },
  ];

  const paymentsColumns = [
    { key: 'orderId', label: 'Order ID', sortable: true, render: (value) => `#${value}` },
    { key: 'course', label: 'Course', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, render: (value) => formatCurrency(value) },
    { key: 'date', label: 'Date', sortable: true, render: (value) => formatDate(value) },
    { key: 'status', label: 'Status', sortable: false },
  ];

  const activityColumns = [
    { key: 'action', label: 'Action', sortable: true },
    { key: 'course', label: 'Course', sortable: true },
    { key: 'timestamp', label: 'Timestamp', sortable: true, render: (value) => formatDate(value) },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to={ROUTES.ADMIN.USERS}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
        >
          <FiArrowLeft size={18} />
          <span>Back to Users</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-stroke p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-font-primary">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Role: {user.role || 'Student'}</p>
              </div>
            </div>
            <button className="bg-primary rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
              transition-all duration-200 ease-in-out border-2 border-primary/80
              shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
              hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
              focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] flex items-center gap-2">
              <FiEdit size={18} />
              <span>Edit User</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-stroke p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Spend</span>
              <FiDollarSign className="text-primary" size={20} />
            </div>
            <p className="text-2xl font-bold text-font-primary">$0.00</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-stroke p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Completion %</span>
              <FiCheckCircle className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-font-primary">0%</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-stroke p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Courses Enrolled</span>
              <FiBook className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-font-primary">{userCourses.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-stroke p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Last Activity</span>
              <FiClock className="text-gray-600" size={20} />
            </div>
            <p className="text-sm font-medium text-font-primary">
              {formatDate(user.lastLogin || user.updatedAt)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-stroke">
          <div className="border-b border-stroke">
            <div className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-gray-600 hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-font-primary mb-4">User Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">First Name</div>
                      <p className="text-font-primary font-medium">{user.firstName || 'N/A'}</p>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Last Name</div>
                      <p className="text-font-primary font-medium">{user.lastName || 'N/A'}</p>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Email</div>
                      <p className="text-font-primary font-medium">{user.email || 'N/A'}</p>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Phone</div>
                      <p className="text-font-primary font-medium">{user.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Status</div>
                      <p className="text-font-primary font-medium">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Member Since</div>
                      <p className="text-font-primary font-medium">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <DataTable
                columns={coursesColumns}
                data={userCourses}
                emptyMessage="No courses enrolled"
              />
            )}

            {activeTab === 'payments' && (
              <DataTable
                columns={paymentsColumns}
                data={userPayments}
                emptyMessage="No payment history"
              />
            )}

            {activeTab === 'activity' && (
              <DataTable
                columns={activityColumns}
                data={userActivity}
                emptyMessage="No activity recorded"
              />
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <textarea
                  rows={6}
                  className="w-full px-4 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add notes about this user..."
                />
                <button className="bg-primary rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                  transition-all duration-200 ease-in-out border-2 border-primary/80
                  shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                  hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                  focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]">
                  Save Notes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminUserProfilePage = () => {
  return <AdminUserProfileContent />;
};

export default AdminUserProfilePage;

