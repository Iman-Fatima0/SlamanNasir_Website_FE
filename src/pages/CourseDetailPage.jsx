/**
 * Course Detail Page component
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CoursesService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Button } from '@/components/common/Button';
import { FiStar, FiUsers, FiClock, FiBook, FiArrowLeft } from 'react-icons/fi';
import { ROUTES } from '@/constants';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => CoursesService.getCourseById(id),
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <ErrorMessage
          message={error.message || 'Failed to load course. Please try again.'}
          className="max-w-2xl"
        />
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to={ROUTES.COURSES}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <FiArrowLeft />
            <span>Back to Courses</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
          {course.instructor && (
            <p className="text-xl text-gray-200">By {course.instructor.name}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Image */}
            {course.thumbnail && (
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-stroke p-8">
              <h2 className="text-2xl font-bold text-font-primary mb-4">About This Course</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </div>

            {/* Chapters */}
            {course.chapters && course.chapters.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-stroke p-8">
                <h2 className="text-2xl font-bold text-font-primary mb-6">Course Content</h2>
                <div className="space-y-4">
                  {course.chapters.map((chapter, index) => (
                    <div key={chapter.id} className="border border-stroke rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-font-primary">{chapter.title}</h3>
                      </div>
                      {chapter.description && (
                        <p className="text-gray-600 ml-11">{chapter.description}</p>
                      )}
                      {chapter.lessons && chapter.lessons.length > 0 && (
                        <div className="mt-3 ml-11 space-y-2">
                          {chapter.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center gap-2 text-sm text-gray-600">
                              <FiBook className="text-primary" />
                              <span>{lesson.title}</span>
                              {lesson.duration && (
                                <span className="text-xs text-gray-500">({lesson.duration} min)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-stroke p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <div className="text-4xl font-bold text-primary mb-2">
                  {formatPrice(course.price)}
                </div>
                <Button variant="primary" size="lg" className="w-full">
                  Enroll Now
                </Button>
              </div>

              {/* Course Info */}
              <div className="space-y-4 border-t border-stroke pt-6">
                <div className="flex items-center gap-3">
                  <FiBook className="text-primary" size={20} />
                  <div>
                    <div className="text-sm text-gray-600">Level</div>
                    <div className="font-semibold text-font-primary">{course.level}</div>
                  </div>
                </div>
                {course.language && (
                  <div className="flex items-center gap-3">
                    <FiBook className="text-primary" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Language</div>
                      <div className="font-semibold text-font-primary">{course.language}</div>
                    </div>
                  </div>
                )}
                {course.rating && (
                  <div className="flex items-center gap-3">
                    <FiStar className="text-secondary fill-secondary" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Rating</div>
                      <div className="font-semibold text-font-primary">
                        {course.rating.toFixed(1)} / 5.0
                      </div>
                    </div>
                  </div>
                )}
                {course.totalStudents && (
                  <div className="flex items-center gap-3">
                    <FiUsers className="text-primary" size={20} />
                    <div>
                      <div className="text-sm text-gray-600">Students</div>
                      <div className="font-semibold text-font-primary">{course.totalStudents}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="mt-6 pt-6 border-t border-stroke">
                  <h3 className="font-semibold text-font-primary mb-3">Instructor</h3>
                  <div className="flex items-center gap-3">
                    {course.instructor.avatar ? (
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {course.instructor?.name?.charAt(0) || 'I'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-font-primary">{course.instructor?.name || 'Instructor'}</div>
                      {course.instructor.specialization && (
                        <div className="text-sm text-gray-600">{course.instructor.specialization}</div>
                      )}
                    </div>
                  </div>
                  <Link
                    to={ROUTES.INSTRUCTOR_DETAIL(course.instructor.id)}
                    className="mt-3 inline-block text-sm text-primary hover:text-primary-dark"
                  >
                    View Profile →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;

