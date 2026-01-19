/**
 * Admin API service functions
 */

import { apiClient } from './api.js';
import { API_ENDPOINTS } from '@/constants';
import { mapCourse, mapCourses } from '@/utils/dataMapper';

export class AdminService {
  /**
   * Get dashboard statistics
   * @param {Object} options - Query options
   * @param {string} options.period - Time period: 'monthly', 'weekly', 'yearly' (default: 'monthly')
   */
  static async getDashboardStats(options = {}) {
    const params = {};
    
    if (options.period) {
      params.period = options.period;
    }
    
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD_STATS, { params });
    
    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch dashboard statistics');
    }
    
    return response.data;
  }

  /**
   * Get all users with pagination and filters
   */
  static async getUsers(filters = {}) {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    // Only add search if it's not empty
    if (filters.search && filters.search.trim() !== '') {
      params.search = filters.search.trim();
    }

    // Only add isActive if it's a valid boolean string ('true' or 'false')
    if (filters.isActive !== undefined && filters.isActive !== '' && filters.isActive !== null) {
      // Convert string 'true'/'false' to boolean, or keep boolean as is
      if (filters.isActive === 'true' || filters.isActive === true) {
        params.isActive = true;
      } else if (filters.isActive === 'false' || filters.isActive === false) {
        params.isActive = false;
      }
    }

    const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS, { params });

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch users');
    }

    return response.data;
  }

  /**
   * Get user by ID
   */
  static async getUserById(id) {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.USER_BY_ID(id));

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch user');
    }

    return response.data;
  }

  /**
   * Update user
   */
  static async updateUser(id, userData) {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.USER_BY_ID(id),
      userData
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to update user');
    }

    return response.data;
  }

  /**
   * Delete user (soft delete)
   */
  static async deleteUser(id) {
    const response = await apiClient.delete(API_ENDPOINTS.ADMIN.USER_BY_ID(id));

    if (response.success === false) {
      throw new Error(response.message || 'Failed to delete user');
    }

    return response.data;
  }

  /**
   * Get all courses with pagination and filters
   */
  static async getCourses(filters = {}) {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  
    if (filters.search?.trim()) {
      params.search = filters.search.trim();
    }
  
    if (filters.status?.trim()) {
      params.status = filters.status.trim();
    }
  
    if (filters.level?.trim()) {
      params.level = filters.level.trim();
    }
  
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.COURSES, { params });
  
    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch courses');
    }
  
    /**
     * 🔑 NORMALIZATION (THIS IS THE FIX)
     * Adjust ONLY this block if backend changes
     */
    const rawCourses =
      response.data?.courses ||
      response.data?.data?.courses ||
      [];
  
    // Transform backend course data to frontend format using dataMapper
    const courses = mapCourses(rawCourses);
  
    const pagination =
      response.data?.pagination ||
      response.data?.data?.pagination ||
      null;
  
    return {
      courses,
      pagination,
    };
  }
  
  /**
   * Get course by ID
   */
  static async getCourseById(id) {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.COURSE_BY_ID(id));

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch course');
    }

    // Transform backend course data to frontend format
    const course = mapCourse(response.data?.course || response.data);

    return {
      ...response.data,
      course,
    };
  }

  /**
   * Create course
   */
  static async createCourse(courseData) {
    const response = await apiClient.post(
      API_ENDPOINTS.ADMIN.COURSES,
      courseData
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to create course');
    }

    return response.data;
  }

  /**
   * Update course
   */
  static async updateCourse(id, courseData) {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.COURSE_BY_ID(id),
      courseData
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to update course');
    }

    return response.data;
  }

  /**
   * Delete course
   */
  static async deleteCourse(id) {
    const response = await apiClient.delete(API_ENDPOINTS.ADMIN.COURSE_BY_ID(id));

    if (response.success === false) {
      throw new Error(response.message || 'Failed to delete course');
    }

    return response.data;
  }

  /**
   * Get all instructors with pagination and filters
   */
  static async getInstructors(filters = {}) {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    // Only add search if it's not empty
    if (filters.search && filters.search.trim() !== '') {
      params.search = filters.search.trim();
    }

    const response = await apiClient.get(API_ENDPOINTS.ADMIN.INSTRUCTORS, { params });

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch instructors');
    }

    return response.data;
  }

  /**
   * Get instructor by ID
   */
  static async getInstructorById(id) {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.INSTRUCTOR_BY_ID(id));

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch instructor');
    }

    return response.data;
  }

  /**
   * Create instructor
   */
  static async createInstructor(instructorData) {
    const response = await apiClient.post(
      API_ENDPOINTS.ADMIN.INSTRUCTORS,
      instructorData
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to create instructor');
    }

    return response.data;
  }

  /**
   * Update instructor
   */
  static async updateInstructor(id, instructorData) {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.INSTRUCTOR_BY_ID(id),
      instructorData
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to update instructor');
    }

    return response.data;
  }

  /**
   * Delete instructor (soft delete)
   */
  static async deleteInstructor(id) {
    const response = await apiClient.delete(API_ENDPOINTS.ADMIN.INSTRUCTOR_BY_ID(id));

    if (response.success === false) {
      throw new Error(response.message || 'Failed to delete instructor');
    }

    return response.data;
  }

  /**
   * Get all orders with pagination and filters
   */
  static async getOrders(filters = {}) {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    // Only add status if it's not empty
    if (filters.status && filters.status.trim() !== '') {
      params.status = filters.status.trim();
    }

    // Only add search if it's not empty
    if (filters.search && filters.search.trim() !== '') {
      params.search = filters.search.trim();
    }

    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ORDERS, { params });

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch orders');
    }

    return response.data;
  }

  /**
   * Get revenue analytics
   * @param {Object} options - Query options
   * @param {string} options.period - Time period: 'daily', 'weekly', 'monthly', 'yearly' (default: 'monthly')
   * @param {string} options.startDate - ISO date string (optional)
   * @param {string} options.endDate - ISO date string (optional)
   */
  static async getRevenueAnalytics(options = {}) {
    const params = {};

    if (options.period) {
      params.period = options.period;
    }

    if (options.startDate) {
      params.startDate = options.startDate;
    }

    if (options.endDate) {
      params.endDate = options.endDate;
    }

    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.REVENUE, { params });

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch revenue analytics');
    }

    return response.data;
  }

  /**
   * Get course analytics
   * @param {Object} options - Query options
   * @param {number} options.limit - Number of courses to return (default: 10)
   * @param {string} options.sortBy - Sort by: 'enrollments', 'revenue', 'completion' (default: 'enrollments')
   * @param {string} options.period - Time period: 'daily', 'weekly', 'monthly', 'yearly' (optional)
   */
  static async getCourseAnalytics(options = {}) {
    const params = {};

    if (options.limit) {
      params.limit = options.limit;
    }

    if (options.sortBy) {
      params.sortBy = options.sortBy;
    }

    if (options.period) {
      params.period = options.period;
    }

    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.COURSES, { params });

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch course analytics');
    }

    return response.data;
  }

  /**
   * Get student analytics
   * @param {Object} options - Query options
   * @param {string} options.period - Time period: 'daily', 'weekly', 'monthly', 'yearly' (default: 'monthly')
   * @param {string} options.startDate - ISO date string (optional)
   * @param {string} options.endDate - ISO date string (optional)
   */
  static async getStudentAnalytics(options = {}) {
    const params = {};

    if (options.period) {
      params.period = options.period;
    }

    if (options.startDate) {
      params.startDate = options.startDate;
    }

    if (options.endDate) {
      params.endDate = options.endDate;
    }

    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.STUDENTS, { params });

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch student analytics');
    }

    return response.data;
  }

  /**
   * Get funnel analytics
   * @param {Object} options - Query options
   * @param {string} options.startDate - ISO date string (optional)
   * @param {string} options.endDate - ISO date string (optional)
   * @param {string} options.category - Filter by course category (optional)
   */
  static async getFunnelAnalytics(options = {}) {
    const params = {};

    if (options.startDate) {
      params.startDate = options.startDate;
    }

    if (options.endDate) {
      params.endDate = options.endDate;
    }

    if (options.category) {
      params.category = options.category;
    }

    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS.FUNNELS, { params });

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch funnel analytics');
    }

    return response.data;
  }

  /**
   * Get order by ID
   */
  static async getOrderById(id) {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ORDER_BY_ID(id));

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch order');
    }

    return response.data;
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(id, statusData) {
    const response = await apiClient.put(
      API_ENDPOINTS.ADMIN.ORDER_STATUS(id),
      statusData
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to update order status');
    }

    return response.data;
  }
}

export default AdminService;

