/**
 * Admin Courses Management Page
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CourseEditor } from '@/components/admin/CourseEditor';
import { DataTable } from '@/components/admin/DataTable';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiFilter } from 'react-icons/fi';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const AdminCoursesContent = () => {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    level: '',
  });

  // Fetch full course details when editing (includes nested chapters and lessons)
  const { data: courseDetails, isLoading: isLoadingCourseDetails } = useQuery({
    queryKey: ['adminCourse', editingCourseId],
    queryFn: () => AdminService.getCourseById(editingCourseId),
    enabled: !!editingCourseId && showCreateForm,
  });

  const editingCourse = courseDetails?.course || null;

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminCourses', filters],
    queryFn: () => AdminService.getCourses({ limit: 100, ...filters }),
  });

  const createCourseMutation = useMutation({
    mutationFn: (courseData) => {
      // Log the data being sent for debugging
      console.log('Creating course with data:', JSON.stringify(courseData, null, 2));
      return AdminService.createCourse(courseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCourses']);
      setShowCreateForm(false);
      setEditingCourseId(null);
    },
    onError: (error) => {
      console.error('Error creating course:', error);
      console.error('Error details:', {
        message: error.message,
        error: error.error,
        errors: error.errors,
        status: error.status,
      });
      // Show more detailed error message
      const errorMessage = error.message || error.error || 'Unknown error';
      const errorDetails = error.errors ? `\n\nDetails: ${JSON.stringify(error.errors, null, 2)}` : '';
      globalThis.alert(`Failed to create course: ${errorMessage}${errorDetails}`);
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }) => AdminService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCourses']);
      setShowCreateForm(false);
      setEditingCourseId(null);
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id) => AdminService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCourses']);
    },
  });

  const courses = data?.courses || data?.data?.courses || [];

  const handleDelete = (id, title) => {
    if (globalThis.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteCourseMutation.mutate(id);
    }
  };

  const handleEdit = (course) => {
    // Fetch full course details with nested chapters and lessons
    setEditingCourseId(course.id);
    setShowCreateForm(true);
  };

  const handleSaveCourse = (courseData) => {
    if (editingCourseId) {
      updateCourseMutation.mutate({ id: editingCourseId, data: courseData });
    } else {
      createCourseMutation.mutate(courseData);
    }
  };

  const courseColumns = [
    {
      key: 'thumbnail',
      label: '',
      sortable: false,
      render: (value) => (
        value ? (
          <img src={value} alt="" className="w-16 h-12 object-cover rounded" />
        ) : (
          <div className="w-16 h-12 bg-gray-200 rounded"></div>
        )
      ),
    },
    { key: 'title', label: 'Title', sortable: true },
    {
      key: 'instructor',
      label: 'Instructor',
      sortable: false,
      render: (_, row) => row.instructor?.name || '—',
    },
    {
      key: 'level',
      label: 'Level',
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value) => {
        if (value === null || value === undefined) return '$0';
        return `$${value}`;
      },
    },
    {
      key: 'isPublished',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'totalStudents',
      label: 'Enrollments',
      sortable: true,
      render: (value) => value || 0,
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.COURSE_DETAIL(row.id)}
            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
            title="View"
          >
            <FiEye size={16} />
          </Link>
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
            title="Edit"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id, row.title)}
            className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
            title="Delete"
          >
            <FiTrash2 size={16} />
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Course Management</h1>
            <p className="text-gray-400 text-sm">Create, edit, and manage courses</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
              transition-all duration-200 ease-in-out border-2 border-primary/80
              shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
              hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
              focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] flex items-center gap-2"
          >
            <FiPlus size={18} />
            Create Course
          </button>
        </div>

        {error && (
          <ErrorMessage
            message={error.message || 'Failed to load courses'}
            className="mb-6"
          />
        )}

        {/* Filters */}
        <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button
              onClick={() => setFilters({ search: '', status: '', level: '' })}
              className="bg-primary rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                transition-all duration-200 ease-in-out border-2 border-primary/80
                shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
            >
              <FiFilter size={18} />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Courses Table */}
        <DataTable
          columns={courseColumns}
          data={courses}
          emptyMessage="No courses found. Create your first course!"
        />

            {/* Course Editor Modal */}
            {showCreateForm && (
              <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                <div className="bg-[#1A1D29] rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden border border-gray-800">
                  {isLoadingCourseDetails && editingCourseId ? (
                    <div className="flex items-center justify-center h-full">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : (
                    <CourseEditor
                      course={editingCourse}
                      onSave={handleSaveCourse}
                      onCancel={() => {
                        setShowCreateForm(false);
                        setEditingCourseId(null);
                      }}
                    />
                  )}
                </div>
              </div>
            )}
      </div>
    </AdminLayout>
  );
};

export const AdminCoursesPage = () => {
  return <AdminCoursesContent />;
};

export default AdminCoursesPage;

