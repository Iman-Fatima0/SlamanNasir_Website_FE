/**
 * User Courses Page
 */

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { UserLayout } from '@/components/user/UserLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Button } from '@/components/common/Button';
import { StudentService } from '@/services';
import { FiBook, FiArrowRight } from 'react-icons/fi';
import { ROUTES } from '@/constants';

const UserCoursesContent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['studentCourses'],
    queryFn: () => StudentService.getCourses(),
  });

  const courses = data?.courses || [];

  return (
    <UserLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-font-primary">My Courses</h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-stroke p-8">
            <ErrorMessage
              message={
                error.status === 500
                  ? 'Server error. Please try again later or contact support if the problem persists.'
                  : error.message || 'Failed to load your courses'
              }
              className="mb-4"
            />
            {error.status === 500 && (
              <div className="mt-4 text-sm text-gray-600">
                <p>If this problem continues, please:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Refresh the page</li>
                  <li>Check your internet connection</li>
                  <li>Contact support if the issue persists</li>
                </ul>
              </div>
            )}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-stroke p-12 text-center">
            <FiBook className="mx-auto text-gray-400 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-font-primary mb-2">No courses yet</h2>
            <p className="text-gray-600 mb-6">You haven't enrolled in any courses yet.</p>
            <Link to={ROUTES.COURSES}>
              <Button variant="primary">Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={ROUTES.COURSE_DETAIL(course.id)}
                className="bg-white border border-stroke rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {course.thumbnailUrl && (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-font-primary mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  {course.subtitle && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {course.subtitle}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {course.level || 'All Levels'}
                    </span>
                    <span className="flex items-center text-primary font-medium text-sm">
                      Continue <FiArrowRight className="ml-1" size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export const UserCoursesPage = () => {
  return (
    <ProtectedRoute>
      <UserCoursesContent />
    </ProtectedRoute>
  );
};

export default UserCoursesPage;
