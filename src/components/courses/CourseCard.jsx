/**
 * Course Card component - Dark themed card (original style)
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

export const CourseCard = ({ course }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Link
      to={ROUTES.COURSE_DETAIL(course.id)}
      className="group block bg-[#6E6554] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 h-full"
    >
      {/* Course Thumbnail - large image on top, no overlays */}
      <div className="relative h-64 md:h-72 bg-black overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title || 'Course image'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary-light">
            <div className="text-white text-6xl font-bold opacity-30">
              {course.title?.charAt(0) || 'ع'}
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6 bg-[#6E6554] flex flex-col h-full">
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#2B211A] transition-colors leading-tight">
          {course.title || 'Course Title'}
        </h3>

        <p className="text-sm text-gray-200/90 mb-6 line-clamp-2 leading-relaxed">
          {course.shortDescription || course.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-3xl font-bold text-white">{formatPrice(course.price)}</span>
          </div>
          <span className="text-sm font-medium text-white group-hover:text-[#2B211A] transition-colors flex items-center gap-1">
            View Details
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
