/**
 * Instructor Analytics API service functions
 */

import { apiClient } from './api.js';
import { API_ENDPOINTS } from '@/constants';

export class InstructorAnalyticsService {
  /**
   * Get instructor analytics overview
   */
  static async getAnalytics() {
    const response = await apiClient.get(API_ENDPOINTS.INSTRUCTOR.ANALYTICS);

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch analytics');
    }

    return response.data;
  }

  /**
   * Get course analytics
   */
  static async getCourseAnalytics(courseId) {
    const response = await apiClient.get(
      API_ENDPOINTS.INSTRUCTOR.COURSE_ANALYTICS(courseId)
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch course analytics');
    }

    return response.data;
  }

  /**
   * Get instructor's courses
   */
  static async getMyCourses() {
    const response = await apiClient.get(API_ENDPOINTS.INSTRUCTOR.COURSES);

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch courses');
    }

    return response.data;
  }

  /**
   * Update instructor's course
   */
  static async updateCourse(courseId, courseData) {
    const response = await apiClient.put(
      API_ENDPOINTS.INSTRUCTOR.COURSE_BY_ID(courseId),
      courseData
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to update course');
    }

    return response.data;
  }

  /**
   * Get course students
   */
  static async getCourseStudents(courseId) {
    const response = await apiClient.get(
      API_ENDPOINTS.INSTRUCTOR.COURSE_STUDENTS(courseId)
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch course students');
    }

    return response.data;
  }

  /**
   * Get student progress for a course
   */
  static async getStudentProgress(courseId, studentId) {
    const response = await apiClient.get(
      API_ENDPOINTS.INSTRUCTOR.STUDENT_PROGRESS(courseId, studentId)
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch student progress');
    }

    return response.data;
  }
}

export default InstructorAnalyticsService;

