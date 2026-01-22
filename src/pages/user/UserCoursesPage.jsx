/**
 * User Courses Page
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { UserLayout } from '@/components/user/UserLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Button } from '@/components/common/Button';
import { StudentService } from '@/services';
import { FiBook, FiArrowRight, FiRefreshCw, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { ROUTES } from '@/constants';

const UserCoursesContent = () => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['studentCourses'],
    queryFn: () => StudentService.getCourses(),
    retry: 1, // Only retry once
    retryDelay: 1000,
  });
  
  const handleRetry = () => {
    queryClient.invalidateQueries(['studentCourses']);
    refetch();
  };
  
  // Check if error is a 500 error
  const isServerError = error?.status === 500 || 
                        error?.response?.status === 500 ||
                        (error?.message && error.message.includes('Server error'));

  const courses = data?.courses || [];

  // Format enrollment date
  const formatEnrollmentDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return null;
    }
  };

  // Get progress percentage from course data
  const getProgressPercentage = (course) => {
    // Check multiple possible locations for progress data
    if (course.progress?.completionPercentage !== undefined) {
      return course.progress.completionPercentage;
    }
    if (course.enrollment?.progress?.completionPercentage !== undefined) {
      return course.enrollment.progress.completionPercentage;
    }
    if (course.completionPercentage !== undefined) {
      return course.completionPercentage;
    }
    return 0;
  };

  // Get enrollment date from course data
  const getEnrollmentDate = (course) => {
    if (course.enrollment?.enrolledAt) return course.enrollment.enrolledAt;
    if (course.enrollment?.createdAt) return course.enrollment.createdAt;
    if (course.enrolledAt) return course.enrolledAt;
    return null;
  };

  return (
    <UserLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">My Courses</h1>
          <p className="text-gray-400 mt-2">Continue your learning journey</p>
          <p className="text-sm text-gray-500 mt-1">
            Only courses with approved purchases appear here. Pending purchases are shown in "My Purchases".
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-[#1A1D29] rounded-xl shadow-sm border border-gray-800 p-8">
            <ErrorMessage
              message={
                isServerError
                  ? 'Server error. Please try again later or contact support if the problem persists.'
                  : error.message || 'Failed to load your courses'
              }
              className="mb-4"
            />
            {isServerError && (
              <div className="mt-4 text-sm text-gray-300">
                <p className="font-medium mb-2">If this problem continues, please:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Refresh the page</li>
                  <li>Check your internet connection</li>
                  <li>Contact support if the issue persists</li>
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-4">
                    Error code: 500 - Internal Server Error. This is a backend issue that our team is working to resolve.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    disabled={isRefetching}
                    className="flex items-center gap-2"
                  >
                    <FiRefreshCw className={isRefetching ? 'animate-spin' : ''} />
                    {isRefetching ? 'Retrying...' : 'Try Again'}
                  </Button>
                </div>
              </div>
            )}
            {!isServerError && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  disabled={isRefetching}
                  className="flex items-center gap-2"
                >
                  <FiRefreshCw className={isRefetching ? 'animate-spin' : ''} />
                  {isRefetching ? 'Retrying...' : 'Try Again'}
                </Button>
              </div>
            )}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-[#1A1D29] rounded-xl shadow-sm border border-gray-800 p-12 text-center">
            <FiBook className="mx-auto text-gray-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-white mb-2">No courses yet</h2>
            <p className="text-gray-400 mb-2">You haven't enrolled in any approved courses yet.</p>
            <p className="text-sm text-gray-500 mb-6">
              If you've made a purchase, it will appear here after admin approval. Check "My Purchases" to see pending orders.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to={ROUTES.COURSES}>
                <Button variant="primary">Browse Courses</Button>
              </Link>
              <Link to={ROUTES.USER.PURCHASES}>
                <Button variant="outline">View My Purchases</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const progressPercentage = getProgressPercentage(course);
              const enrollmentDate = getEnrollmentDate(course);
              const isCompleted = progressPercentage >= 100;

              return (
                <Link
                  key={course.id}
                  to={ROUTES.USER.COURSE_LEARNING(course.id)}
                  className="bg-[#1A1D29] border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 hover:shadow-xl transition-all flex flex-col"
                >
                  {/* Course Thumbnail */}
                  <div className="relative">
                    {course.thumbnailUrl && (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    {/* Progress Badge Overlay */}
                    {isCompleted && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <FiCheckCircle size={12} />
                        Completed
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    {/* Course Title and Subtitle */}
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    {course.subtitle && (
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {course.subtitle}
                      </p>
                    )}

                    {/* Enrollment Date */}
                    {enrollmentDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                        <FiCalendar size={12} />
                        <span>Enrolled {formatEnrollmentDate(enrollmentDate)}</span>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-xs font-medium text-gray-300">
                          {progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCompleted
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Course Level and Continue Button */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-800">
                      <span className="text-sm text-gray-500">
                        {course.level || 'All Levels'}
                      </span>
                      <span className="flex items-center text-blue-400 font-medium text-sm">
                        {isCompleted ? 'Review' : 'Continue'} <FiArrowRight className="ml-1" size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
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
