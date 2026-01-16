/**
 * Courses Page component - displays all courses with filters and pagination
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CoursesService } from '@/services';
import { CourseGrid } from '@/components/courses/CourseGrid';
import { FiChevronLeft, FiChevronRight, FiSearch, FiX } from 'react-icons/fi';

export const CoursesPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    level: '',
    language: '',
    search: '',
    isPublished: true,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses', filters],
    queryFn: () => CoursesService.getAllCourses(filters),
  });

  const courses = data?.data?.courses || [];
  const pagination = data?.data?.pagination || {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-secondary-dark">
      {/* Header with Search in Top Right */}
      <div className="bg-secondary-dark text-white py-8 relative pt-24 md:pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">All Courses</h1>
              <p className="text-xl text-white/80">
                Discover our complete collection of Arabic language courses
              </p>
            </div>
            
            {/* Small Search in Top Right */}
            <div className="relative w-full md:w-64">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange({ ...filters, search: e.target.value, page: 1 })}
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-sm"
                />
                {filters.search && (
                  <button
                    onClick={() => handleFilterChange({ ...filters, search: '', page: 1 })}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        {!isLoading && !error && (
          <div className="mb-6 text-sm text-white/80">
            Showing {courses.length} of {pagination.total} courses
          </div>
        )}

        <CourseGrid courses={courses} isLoading={isLoading} error={error} />

        {/* Pagination */}
        {!isLoading && !error && pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-white/10 text-white border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <FiChevronLeft />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first page, last page, current page, and pages around current
                  return (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  const showEllipsis = index > 0 && page - array[index - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-2 text-white">...</span>}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          page === pagination.page
                            ? 'bg-white text-secondary-dark'
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-white/10 text-white border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;

