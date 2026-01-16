/**
 * Admin Courses Management Page
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService, CoursesService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AdminRoute } from '@/components/common/AdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const AdminCoursesContent = () => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: () => CoursesService.getAllCourses({ limit: 100 }),
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id) => AdminService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCourses']);
    },
  });

  const courses = data?.data?.courses || [];

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteCourseMutation.mutate(id);
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
            <h1 className="text-4xl font-bold text-font-primary mb-2">Course Management</h1>
            <p className="text-gray-600">Create, edit, and manage courses</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-secondary-dark text-white px-6 py-3 rounded-lg hover:bg-secondary-dark/90 transition-colors flex items-center gap-2"
          >
            <FiPlus size={20} />
            Create Course
          </button>
        </div>

        {error && (
          <ErrorMessage
            message={error.message || 'Failed to load courses'}
            className="mb-6"
          />
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-stroke overflow-hidden">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-font-primary mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.shortDescription}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary">
                    ${course.price || 0}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    to={ROUTES.COURSE_DETAIL(course.id)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiEye size={16} />
                    View
                  </Link>
                  <button
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <FiEdit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id, course.title)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    disabled={deleteCourseMutation.isLoading}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-stroke">
            <p className="text-gray-600 mb-4">No courses found</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-secondary-dark text-white px-6 py-3 rounded-lg hover:bg-secondary-dark/90 transition-colors"
            >
              Create Your First Course
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export const AdminCoursesPage = () => {
  return (
    <AdminRoute>
      <AdminCoursesContent />
    </AdminRoute>
  );
};

export default AdminCoursesPage;

