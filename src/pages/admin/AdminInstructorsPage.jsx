/**
 * Admin Instructors Management Page
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { FiPlus, FiEdit, FiTrash2, FiUser } from 'react-icons/fi';

const AdminInstructorsContent = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminInstructors'],
    queryFn: () => AdminService.getInstructors({ limit: 100 }),
  });

  const deleteInstructorMutation = useMutation({
    mutationFn: (id) => AdminService.deleteInstructor(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminInstructors']);
    },
  });

  const instructors = data?.instructors || data?.data?.instructors || [];

  const handleDelete = (id, name) => {
    if (globalThis.confirm(`Are you sure you want to delete instructor "${name}"?`)) {
      deleteInstructorMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-font-primary mb-2">Instructor Management</h1>
            <p className="text-gray-600">Create, edit, and manage instructors</p>
          </div>
          <button
            onClick={() => {
              // TODO: Implement create instructor form/modal
              globalThis.alert('Create instructor functionality coming soon');
            }}
            className="bg-primary rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
              transition-all duration-200 ease-in-out border-2 border-primary/80
              shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
              hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
              focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] flex items-center gap-2"
          >
            <FiPlus size={18} />
            Add Instructor
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {error && !isLoading && (
          <div className="mb-6">
            <ErrorMessage
              message={
                error.message?.includes('404') || error.message?.includes('Not Found')
                  ? 'Instructors endpoint not found. Please ensure the backend API endpoint /api/admin/instructors is implemented.'
                  : error.message || 'Failed to load instructors'
              }
              className="mb-6"
            />
          </div>
        )}

        {!error && !isLoading && (
          <>
            {/* Instructors Grid */}
            {instructors.length > 0 ? (
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
                  className="flex-1 bg-primary rounded-[50px] text-white cursor-pointer text-xs py-1.5 px-4
                    transition-all duration-200 ease-in-out border-2 border-primary/80
                    shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.1)]
                    hover:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.15),1px_1px_3px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)]
                    focus:outline-none focus:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.15),1px_1px_3px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
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
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-stroke">
                <p className="text-gray-600 mb-4">No instructors found</p>
                <button
                  onClick={() => {
                    // TODO: Implement create instructor form/modal
                    globalThis.alert('Create instructor functionality coming soon');
                  }}
                  className="bg-primary rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                    transition-all duration-200 ease-in-out border-2 border-primary/80
                    shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                    hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                    focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]"
                >
                  Add Your First Instructor
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export const AdminInstructorsPage = () => {
  return <AdminInstructorsContent />;
};

export default AdminInstructorsPage;

