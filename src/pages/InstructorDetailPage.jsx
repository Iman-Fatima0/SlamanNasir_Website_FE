/**
 * Instructor Detail Page component
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { InstructorsService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { CourseCard } from '@/components/courses/CourseCard';
import { FiBook, FiArrowLeft, FiMail } from 'react-icons/fi';
import { ROUTES } from '@/constants';

export const InstructorDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['instructor', id],
    queryFn: () => InstructorsService.getInstructorById(id, true),
  });

  const instructor = data?.data?.instructor || data?.data;
  const courses = instructor?.courses || [];

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
          message={error.message || 'Failed to load instructor. Please try again.'}
          className="max-w-2xl"
        />
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-font-primary mb-4">Instructor not found</h2>
          <Link to={ROUTES.INSTRUCTORS}>
            <button className="px-6 py-2 bg-primary text-white rounded-lg">Browse Instructors</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white pt-20 md:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to={ROUTES.INSTRUCTORS}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <FiArrowLeft />
            <span>Back to Instructors</span>
          </Link>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {instructor.avatar ? (
              <img
                src={instructor.avatar}
                alt={instructor.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-5xl font-bold">{instructor.name?.charAt(0) || 'I'}</span>
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{instructor.name || 'Instructor'}</h1>
              {instructor.specialization && (
                <p className="text-xl text-gray-200 mb-4">{instructor.specialization}</p>
              )}
              {instructor.email && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <FiMail />
                  <span className="text-gray-200">{instructor.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Bio */}
            {instructor.bio && (
              <div className="bg-white rounded-xl shadow-sm border border-stroke p-8 mb-8">
                <h2 className="text-2xl font-bold text-font-primary mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{instructor.bio}</p>
              </div>
            )}

            {/* Courses */}
            <div className="bg-white rounded-xl shadow-sm border border-stroke p-8">
              <div className="flex items-center gap-3 mb-6">
                <FiBook className="text-primary" size={24} />
                <h2 className="text-2xl font-bold text-font-primary">
                  Courses ({courses.length})
                </h2>
              </div>
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No courses available yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-stroke p-6 sticky top-24">
              <h3 className="font-semibold text-font-primary mb-4">Instructor Info</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Courses</div>
                  <div className="text-2xl font-bold text-primary">{courses.length}</div>
                </div>
                {instructor.specialization && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Specialization</div>
                    <div className="font-semibold text-font-primary">{instructor.specialization}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetailPage;

