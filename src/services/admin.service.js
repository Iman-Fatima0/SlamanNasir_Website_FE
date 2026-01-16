/**
 * Admin API service functions
 */

import { apiClient } from './api.js';
import { API_ENDPOINTS } from '@/constants';

export class AdminService {
  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD_STATS);
    
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

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.isActive !== undefined) {
      params.isActive = filters.isActive;
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

    if (filters.status) {
      params.status = filters.status;
    }

    if (filters.search) {
      params.search = filters.search;
    }

    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ORDERS, { params });

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch orders');
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

