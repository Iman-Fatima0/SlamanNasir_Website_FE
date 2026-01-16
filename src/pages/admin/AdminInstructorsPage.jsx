/**
 * Admin Instructors Management Page
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService, InstructorsService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AdminRoute } from '@/components/common/AdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { FiPlus, FiEdit, FiTrash2, FiUser } from 'react-icons/fi';

const AdminInstructorsContent = () => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminInstructors'],
    queryFn: () => InstructorsService.getAllInstructors({ limit: 100 }),
  });

  const deleteInstructorMutation = useMutation({
    mutationFn: (id) => AdminService.deleteInstructor(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminInstructors']);
    },
  });

  const instructors = data?.data?.instructors || [];

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete instructor "${name}"?`)) {
      deleteInstructorMutation.mutate(id);
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-font-primary mb-2">Instructor Management</h1>
            <p className="text-gray-600">Create, edit, and manage instructors</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-secondary-dark text-white px-6 py-3 rounded-lg hover:bg-secondary-dark/90 transition-colors flex items-center gap-2"
          >
            <FiPlus size={20} />
            Add Instructor
          </button>
        </div>

        {error && (
          <ErrorMessage
            message={error.message || 'Failed to load instructors'}
            className="mb-6"
          />
        )}

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="bg-white rounded-xl shadow-sm border border-stroke p-6">
              <div className="flex items-center gap-4 mb-4">
                {instructor.avatarUrl ? (
                  <img
                    src={instructor.avatarUrl}
                    alt={instructor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                    <FiUser size={24} />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-font-primary">{instructor.name}</h3>
                  <p className="text-sm text-gray-600">{instructor.title}</p>
                </div>
              </div>
              {instructor.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{instructor.bio}</p>
              )}
              <div className="flex items-center gap-2">
                <Link
                  to={ROUTES.INSTRUCTOR_DETAIL(instructor.id)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
                >
                  View
                </Link>
                <button
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  <FiEdit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(instructor.id, instructor.name)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  disabled={deleteInstructorMutation.isLoading}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {instructors.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-stroke">
            <p className="text-gray-600 mb-4">No instructors found</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-secondary-dark text-white px-6 py-3 rounded-lg hover:bg-secondary-dark/90 transition-colors"
            >
              Add Your First Instructor
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export const AdminInstructorsPage = () => {
  return (
    <AdminRoute>
      <AdminInstructorsContent />
    </AdminRoute>
  );
};

export default AdminInstructorsPage;

