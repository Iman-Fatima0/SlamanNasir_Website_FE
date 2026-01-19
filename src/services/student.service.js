/**
 * Student API service functions
 */

import { apiClient } from './api.js';
import { API_ENDPOINTS } from '@/constants';

export class StudentService {
  /**
   * Get all student enrollments
   */
  static async getEnrollments() {
    const response = await apiClient.get(API_ENDPOINTS.STUDENT.ENROLLMENTS);

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch enrollments');
    }

    return response.data;
  }

  /**
   * Create enrollment
   */
  static async createEnrollment(courseId) {
    const response = await apiClient.post(
      API_ENDPOINTS.STUDENT.ENROLLMENTS,
      { courseId }
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to create enrollment');
    }

    return response.data;
  }

  /**
   * Get enrollment by ID
   */
  static async getEnrollmentById(id) {
    const response = await apiClient.get(
      API_ENDPOINTS.STUDENT.ENROLLMENT_BY_ID(id)
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch enrollment');
    }

    return response.data;
  }

  /**
   * Get enrollment progress (by enrollment ID)
   */
  static async getEnrollmentProgress(enrollmentId) {
    const response = await apiClient.get(
      API_ENDPOINTS.STUDENT.PROGRESS_BY_ENROLLMENT(enrollmentId)
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch progress');
    }

    return response.data;
  }

  /**
   * Get course progress (by course ID) - Legacy method
   * @deprecated Use getEnrollmentProgress with enrollmentId instead
   */
  static async getCourseProgress(courseId) {
    const response = await apiClient.get(
      API_ENDPOINTS.STUDENT.PROGRESS_BY_COURSE(courseId)
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch progress');
    }

    return response.data;
  }

  /**
   * Update lesson progress
   */
  static async updateLessonProgress(courseId, lessonId, completed) {
    const response = await apiClient.put(
      API_ENDPOINTS.STUDENT.PROGRESS_LESSON(courseId, lessonId),
      { completed }
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to update lesson progress');
    }

    return response.data;
  }

  /**
   * Submit quiz
   */
  static async submitQuiz(courseId, quizId, answers) {
    const response = await apiClient.post(
      API_ENDPOINTS.STUDENT.PROGRESS_QUIZ(courseId, quizId),
      { answers }
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to submit quiz');
    }

    return response.data;
  }

  /**
   * Get all student certificates
   */
  static async getCertificates() {
    const response = await apiClient.get(API_ENDPOINTS.STUDENT.CERTIFICATES);

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch certificates');
    }

    return response.data;
  }

  /**
   * Get certificate by ID
   */
  static async getCertificateById(id) {
    const response = await apiClient.get(
      API_ENDPOINTS.STUDENT.CERTIFICATE_BY_ID(id)
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch certificate');
    }

    return response.data;
  }
}

export default StudentService;

