/**
 * Instructor-related API service functions
 */

import { apiClient } from './api.js';
import { API_ENDPOINTS } from '@/constants';
import { mapInstructor, mapInstructors } from '@/utils/dataMapper';

export class InstructorsService {
  /**
   * Get all instructors with optional filters and pagination
   */
  static async getAllInstructors(filters = {}) {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 12,
    };

    if (filters.search) {
      params.search = filters.search;
    }

    const response = await apiClient.get(
      API_ENDPOINTS.INSTRUCTORS,
      { params }
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch instructors');
    }

    // Transform backend data to frontend format
    return {
      ...response,
      data: {
        ...response.data,
        instructors: mapInstructors(response.data?.instructors || []),
      },
    };
  }

  /**
   * Get a single instructor by ID
   */
  static async getInstructorById(id, includeCourses = false) {
    const params = includeCourses ? { includeCourses: true } : {};
    
    const response = await apiClient.get(
      API_ENDPOINTS.INSTRUCTOR_BY_ID(id),
      { params }
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch instructor');
    }

    // Transform backend data to frontend format
    return {
      ...response,
      data: {
        ...response.data,
        instructor: mapInstructor(response.data),
      },
    };
  }

  /**
   * Create instructor (admin only)
   */
  static async createInstructor(data) {
    const response = await apiClient.post(
      API_ENDPOINTS.INSTRUCTORS,
      data
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to create instructor');
    }

    return response;
  }

  /**
   * Update instructor (admin only)
   */
  static async updateInstructor(id, data) {
    const response = await apiClient.put(
      API_ENDPOINTS.INSTRUCTOR_BY_ID(id),
      data
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to update instructor');
    }

    return response;
  }

  /**
   * Delete instructor (admin only)
   */
  static async deleteInstructor(id) {
    const response = await apiClient.delete(
      API_ENDPOINTS.INSTRUCTOR_BY_ID(id)
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to delete instructor');
    }

    return response;
  }
}

export default InstructorsService;

