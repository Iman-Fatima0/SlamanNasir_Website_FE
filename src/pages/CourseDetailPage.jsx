/**
 * Course Detail Page component
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CoursesService, AdminService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Button } from '@/components/common/Button';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
import { ROUTES } from '@/constants';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();
  
  // Try admin endpoint first if user is admin, fallback to public endpoint
  const { data, isLoading, error } = useQuery({
    queryKey: ['course', id, isAdmin],
    queryFn: async () => {
      // If admin, try admin endpoint first
      if (isAdmin) {
        try {
          const adminData = await AdminService.getCourseById(id);
          return {
            ...adminData,
            data: {
              ...adminData,
              course: adminData.course || adminData,
            },
          };
        } catch (adminError) {
          // If admin endpoint fails, fallback to public endpoint
          console.warn('Admin endpoint failed, trying public endpoint:', adminError);
          return CoursesService.getCourseById(id);
        }
      }
      // Regular user, use public endpoint
      return CoursesService.getCourseById(id);
    },
    retry: false, // Don't retry automatically
  });

  const course = data?.data?.course || data?.data;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-dark -mt-16 pt-16 md:-mt-20 md:pt-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    // Check if error is related to database schema or 500 server error
    const isSchemaError = error.message?.includes('does not exist') || 
                         error.message?.includes('column') ||
                         error.message?.includes('type') ||
                         error.message?.includes('Database configuration') ||
                         error.status === 500;
    
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <ErrorMessage
            message={
              isSchemaError
                ? 'Course data is temporarily unavailable due to a server error. This may be due to a database configuration issue. Please try again later or contact support.'
                : error.message || 'Failed to load course. Please try again.'
            }
            className="mb-4"
          />
          <div className="flex gap-4 justify-center">
            <Link to={ROUTES.COURSES}>
              <Button variant="primary">Back to Courses</Button>
            </Link>
            <Link to={ROUTES.ADMIN.COURSES}>
              <Button variant="secondary">Back to Admin</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-font-primary mb-4">Course not found</h2>
          <Link to={ROUTES.COURSES}>
            <Button variant="primary">Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3ee] -mt-16 pt-16 md:-mt-20 md:pt-20">
      {/* Top hero layout: clean background + course summary */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Link
            to={ROUTES.COURSES}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6"
          >
            <FiArrowLeft />
            <span>Back to Courses</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr),minmax(0,1.1fr)] gap-10 lg:gap-16 items-start bg-[#f8f6f1] rounded-2xl border border-[#e0dbcf] p-6 md:p-8 lg:p-10 shadow-sm">
            {/* Image / media */}
            <div className="w-full">
              <div className="overflow-hidden rounded-xl border border-[#ddd3c3] bg-[#e7dfcf]">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-64 md:h-80 lg:h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 md:h-80 lg:h-96 flex items-center justify-center text-gray-500 text-lg">
                    Course preview coming soon
                  </div>
                )}
              </div>
            </div>

            {/* Text / meta */}
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">
                  Course
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-snug text-[#1f130c] mb-3">
                  {course.title}
                </h1>
                {course.shortDescription && (
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-xl">
                    {course.shortDescription}
                  </p>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                {course.level && (
                  <p>
                    <span className="font-semibold">Level:&nbsp;</span>
                    {course.level}
                  </p>
                )}
                {course.language && (
                  <p>
                    <span className="font-semibold">Language:&nbsp;</span>
                    {course.language}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-2xl md:text-3xl font-bold text-[#1f130c]">
                  {formatPrice(course.price)}
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-8"
                  onClick={() => navigate(ROUTES.CHECKOUT(id))}
                >
                  Enroll Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What makes this course different */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-[#1f130c] mb-3">
              What Makes This Course Different?
            </h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>
        </div>
      </section>

      {/* Course Curriculum with lock icons */}
      {course.chapters && course.chapters.length > 0 && (
        <section className="py-12 md:py-16 bg-[#111] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Course Curriculum</h2>
            <p className="text-sm text-white/70 mb-6">
              Preview the full lesson list. Content will unlock after you enroll.
            </p>

            <div className="rounded-xl border border-white/10 bg-black/70 overflow-hidden divide-y divide-white/10">
              {course.chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id || chapterIndex}>
                  <div className="px-4 md:px-6 py-3 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3 text-sm md:text-base">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-black text-xs font-semibold">
                        {chapterIndex + 1}
                      </span>
                      <span className="font-semibold">
                        {chapter.title || `Chapter ${chapterIndex + 1}`}
                      </span>
                    </div>
                    {chapter.lessons && (
                      <span className="text-xs text-white/60">
                        {(chapter.lessons || []).length} lessons
                      </span>
                    )}
                  </div>

                  {chapter.lessons && Array.isArray(chapter.lessons) && chapter.lessons.length > 0 && (
                    <div className="bg-black/40">
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id || `${chapterIndex}-${lessonIndex}`}
                          className="px-4 md:px-6 py-2.5 flex items-center gap-3 text-sm text-white/80"
                        >
                          <FiLock className="text-white/60" size={14} />
                          <span className="flex-1">
                            {lesson.title || `Lesson ${lessonIndex + 1}`}
                          </span>
                          {lesson.duration && (
                            <span className="text-xs text-white/50">
                              {lesson.duration} min
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CourseDetailPage;

