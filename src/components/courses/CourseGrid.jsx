/**
 * Course Grid component for displaying multiple courses
 * Includes a smooth scroll-up reveal animation for each course card.
 */

import React, { useEffect, useRef, useState } from 'react';
import { CourseCard } from './CourseCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

const AnimatedCourseCard = ({ course, index }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <CourseCard course={course} />
    </div>
  );
};

export const CourseGrid = ({ courses, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.message || 'Failed to load courses. Please try again later.'}
        className="max-w-2xl mx-auto"
      />
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No courses found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <AnimatedCourseCard key={course.id} course={course} index={index} />
      ))}
    </div>
  );
};

export default CourseGrid;

