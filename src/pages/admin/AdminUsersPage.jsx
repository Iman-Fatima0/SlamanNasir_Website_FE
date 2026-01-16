/**
 * Admin Users Management Page
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AdminRoute } from '@/components/common/AdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FiSearch, FiEdit, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

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

  const users = data?.users || [];
  const pagination = data?.pagination || {};

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-font-primary mb-2">User Management</h1>
          <p className="text-gray-600">Manage all platform users</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-stroke p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full pl-10 pr-4 py-2 border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
              className="px-4 py-2 border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
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
        <div className="bg-white rounded-xl shadow-sm border border-stroke overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-font-primary">Name</th>
                  <th className="text-left py-3 px-6 font-semibold text-font-primary">Email</th>
                  <th className="text-left py-3 px-6 font-semibold text-font-primary">Status</th>
                  <th className="text-left py-3 px-6 font-semibold text-font-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-stroke hover:bg-gray-50">
                    <td className="py-4 px-6">
                      {editingUser === user.id ? (
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="w-full px-3 py-1 border border-stroke rounded"
                        />
                      ) : (
                        <div className="font-medium text-font-primary">
                          {user.firstName} {user.lastName}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      {editingUser === user.id ? (
                        <select
                          value={editForm.isActive}
                          onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                          className="px-3 py-1 border border-stroke rounded"
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {editingUser === user.id ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                              disabled={updateUserMutation.isLoading}
                            >
                              <FiCheck size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingUser(null);
                                setEditForm({});
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                              <FiX size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-primary hover:bg-primary/10 rounded"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              disabled={deleteUserMutation.isLoading}
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
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
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
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

export const AdminUsersPage = () => {
  return (
    <AdminRoute>
      <AdminUsersContent />
    </AdminRoute>
  );
};

export default AdminUsersPage;

