/**
 * Instructors Page component
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { InstructorsService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FiSearch, FiUser, FiBook } from 'react-icons/fi';
import { ROUTES } from '@/constants';

export const InstructorsPage = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['instructors', filters],
    queryFn: () => InstructorsService.getAllInstructors(filters),
  });

  const instructors = data?.data?.instructors || [];
  const pagination = data?.data?.pagination || {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setFilters({ ...filters, search: value, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-16 pt-24 md:pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-1 bg-secondary rounded-full mx-auto"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Our Instructors</h1>
          <p className="text-xl text-gray-200 text-center max-w-2xl mx-auto">
            Meet our expert Arabic language instructors dedicated to your learning success
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search instructors..."
              className="w-full pl-10 pr-4 py-3 border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error */}
        {error && (
          <ErrorMessage
            message={error.message || 'Failed to load instructors. Please try again.'}
            className="max-w-2xl mx-auto"
          />
        )}

        {/* Instructors Grid */}
        {!isLoading && !error && instructors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((instructor) => (
              <Link
                key={instructor.id}
                to={ROUTES.INSTRUCTOR_DETAIL(instructor.id)}
                className="bg-white rounded-xl border border-stroke shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 p-6"
              >
                <div className="flex flex-col items-center text-center">
                  {instructor.avatarUrl ? (
                    <img
                      src={instructor.avatarUrl}
                      alt={instructor.name}
                      className="w-24 h-24 rounded-full mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl mb-4">
                      {instructor.name?.charAt(0) || 'I'}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-font-primary mb-2">{instructor.name || 'Instructor'}</h3>
                  {instructor.title && (
                    <p className="text-sm text-secondary font-medium mb-3">{instructor.title}</p>
                  )}
                  {instructor.bio && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{instructor.bio}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiBook />
                      <span>{instructor.courses?.length || 0} Courses</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && instructors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No instructors found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorsPage;

