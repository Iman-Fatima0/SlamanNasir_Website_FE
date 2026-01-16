/**
 * Course Card component - Vakil Mosque style
 */

import { Link } from 'react-router-dom';
import { FiStar, FiUsers } from 'react-icons/fi';
import { ROUTES } from '@/constants';

export const CourseCard = ({ course }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const levelColors = {
    Beginner: 'bg-green-600 text-white',
    Intermediate: 'bg-yellow-600 text-white',
    Advanced: 'bg-red-600 text-white',
  };

  return (
    <Link
      to={ROUTES.COURSE_DETAIL(course.id)}
      className="group block bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
    >
      {/* Course Thumbnail */}
      <div className="relative h-56 bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title || 'Course image'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-6xl font-bold opacity-30">
              {course.title?.charAt(0) || 'ع'}
            </div>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Level Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1.5 text-xs font-semibold rounded-full ${levelColors[course.level] || levelColors.Beginner} shadow-lg`}
          >
            {course.level}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 bg-gray-900">
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-secondary transition-colors leading-tight">
          {course.title || 'Course Title'}
        </h3>

        {course.instructor?.name && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {course.instructor.name?.charAt(0) || 'I'}
              </span>
            </div>
            <p className="text-sm text-gray-400">By {course.instructor.name}</p>
          </div>
        )}

        <p className="text-sm text-gray-400 mb-5 line-clamp-2 leading-relaxed">
          {course.shortDescription || course.description}
        </p>

        {/* Course Meta */}
        <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-800">
          <div className="flex items-center gap-4 text-sm">
            {course.rating && (
              <div className="flex items-center gap-1.5">
                <FiStar className="text-secondary fill-secondary" size={16} />
                <span className="font-semibold text-white">{course.rating.toFixed(1)}</span>
              </div>
            )}
            {course.totalStudents && (
              <div className="flex items-center gap-1.5 text-gray-400">
                <FiUsers size={16} />
                <span>{course.totalStudents}</span>
              </div>
            )}
          </div>
          {course.language && (
            <span className="text-xs px-3 py-1.5 bg-gray-800 rounded-full text-gray-300 font-medium">
              {course.language}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-white">{formatPrice(course.price)}</span>
          </div>
          <span className="text-sm font-medium text-secondary group-hover:text-secondary-light transition-colors flex items-center gap-1">
            View Details
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
