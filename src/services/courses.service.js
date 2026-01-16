/**
 * Course-related API service functions
 */

import { apiClient } from './api.js';
import { API_ENDPOINTS, API_CONFIG } from '@/constants';
import { mapCourse, mapCourses } from '@/utils/dataMapper';

export class CoursesService {
  /**
   * Get all courses with optional filters and pagination
   */
  static async getAllCourses(filters = {}) {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || API_CONFIG.DEFAULT_PAGE_SIZE,
      isPublished: filters.isPublished === undefined ? true : filters.isPublished,
    };

    if (filters.level) {
      params.level = filters.level;
    }

    if (filters.language) {
      params.language = filters.language;
    }

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.instructorId) {
      params.instructorId = filters.instructorId;
    }

    const response = await apiClient.get(
      API_ENDPOINTS.COURSES,
      { params }
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch courses');
    }

    // Transform backend data to frontend format
    return {
      ...response,
      data: {
        ...response.data,
        courses: mapCourses(response.data?.courses || []),
      },
    };
  }

  /**
   * Get featured courses (for home page)
   */
  static async getFeaturedCourses(limit = API_CONFIG.FEATURED_COURSES_LIMIT) {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.COURSES,
        {
          params: {
            limit,
            isPublished: true,
          },
        }
      );

      if (response.success === false) {
        throw new Error(response.message || 'Failed to fetch featured courses');
      }

      // Transform backend data to frontend format
      return {
        ...response,
        data: {
          ...response.data,
          courses: mapCourses(response.data?.courses || []),
        },
      };
    } catch (error) {
      // Log error for debugging
      console.error('Error fetching featured courses:', error);
      // Re-throw with a user-friendly message
      throw new Error(error.message || 'Unable to load courses. Please check if the backend server is running.');
    }
  }

  /**
   * Get a single course by ID
   */
  static async getCourseById(id) {
    const response = await apiClient.get(
      API_ENDPOINTS.COURSE_BY_ID(id)
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch course');
    }

    // Transform backend data to frontend format
    return {
      ...response,
      data: {
        ...response.data,
        course: mapCourse(response.data),
      },
    };
  }
}

export default CoursesService;

