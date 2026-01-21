/**
 * Admin Users Management Page
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/DataTable';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { FiSearch, FiEdit, FiTrash2, FiX, FiCheck, FiEye } from 'react-icons/fi';

const AdminUsersContent = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    isActive: '',
  });
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminUsers', filters],
    queryFn: () => AdminService.getUsers(filters),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => AdminService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      setEditingUser(null);
      setEditForm({});
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => AdminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
    },
  });

  const users = data?.data?.users || data?.users || [];
  const pagination = data?.data?.pagination || data?.pagination || {};

  const userColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (_, row) => (
        <div className="font-medium text-white">
          {row.firstName} {row.lastName}
        </div>
      ),
    },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
          {value || 'Student'}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.ADMIN.USER_PROFILE(row.id)}
            className="p-2 text-primary hover:bg-primary/10 rounded"
            title="View Profile"
          >
            <FiEye size={18} />
          </Link>
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-primary hover:bg-primary/10 rounded"
            title="Edit"
          >
            <FiEdit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
            disabled={deleteUserMutation.isLoading}
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
  };

  const handleSave = () => {
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser, data: editForm });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      deleteUserMutation.mutate(id);
    }
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
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
          <p className="text-gray-400 text-sm">Manage all platform users</p>
        </div>

        {/* Filters */}
        <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Users</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {error && (
          <ErrorMessage
            message={error.message || 'Failed to load users'}
            className="mb-6"
          />
        )}

        {/* Users Table */}
        <DataTable
          columns={userColumns}
          data={users}
          pagination={pagination}
          onPageChange={(page) => setFilters({ ...filters, page })}
          emptyMessage="No users found"
        />
      </div>
    </AdminLayout>
  );
};

export const AdminUsersPage = () => {
  return <AdminUsersContent />;
};

export default AdminUsersPage;

