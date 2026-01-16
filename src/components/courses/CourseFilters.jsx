/**
 * Course Filters component
 */

import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export const CourseFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onFilterChange({ ...filters, search: value, page: 1 });
  };

  const handleLevelChange = (e) => {
    const value = e.target.value;
    onFilterChange({ ...filters, level: value || '', page: 1 });
  };

  const hasActiveFilters = filters.search || filters.level;

  return (
    <div className="bg-white border border-stroke rounded-lg p-6 mb-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-font-primary mb-2">
            Search Courses
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="search"
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search by title, description..."
              className="w-full pl-10 pr-4 py-2 border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
            {searchValue && (
              <button
                onClick={() => {
                  setSearchValue('');
                  onFilterChange({ ...filters, search: '', page: 1 });
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        {/* Level Filter */}
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-font-primary mb-2">
            Level
          </label>
          <select
            id="level"
            value={filters.level || ''}
            onChange={handleLevelChange}
            className="w-full px-4 py-2 border border-stroke rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-stroke">
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-2"
          >
            <FiX />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseFilters;

