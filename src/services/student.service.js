/**
 * Student API service functions
 */

import { apiClient } from './api.js';
import { API_ENDPOINTS } from '@/constants';
import { mapCourse, mapCourses } from '@/utils/dataMapper';

export class StudentService {
  /**
   * Get all courses the student is enrolled in (order verified)
   * Returns only courses the user has access to via valid orders/enrollments
   */
  static async getCourses() {
    const response = await apiClient.get(API_ENDPOINTS.STUDENT.COURSES);

    if (response.success === false) {
      throw new Error(response.message || 'Failed to fetch courses');
    }

    // Transform backend course data to frontend format
    const rawCourses = response.data?.courses || response.data?.data?.courses || [];
    const courses = mapCourses(rawCourses);

    return {
      courses,
      ...response.data,
    };
  }

  /**
   * Get course by ID (only if student has access via valid order/enrollment)
   * Returns full course data with nested chapters and lessons
   */
  static async getCourseById(id) {
    const response = await apiClient.get(API_ENDPOINTS.STUDENT.COURSE_BY_ID(id));

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
   * Submit manual checkout for a course (creates pending order, no enrollment)
   * Body matches backend spec:
   * { courseId, paymentProofUrl, transactionReference, notes }
   */
  static async checkout(payload) {
    const response = await apiClient.post(
      API_ENDPOINTS.STUDENT.CHECKOUT,
      payload
    );

    if (response.success === false) {
      throw new Error(response.message || 'Failed to submit checkout');
    }

    return response.data;
  }

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
   * Legacy: direct enrollment creation (now disabled in backend)
   * Kept only for backward compatibility; will now 403.
   */
  static async createEnrollment(courseId) {
    const response = await apiClient.post(
      API_ENDPOINTS.STUDENT.ENROLLMENTS,
      { courseId }
    );

    // This will normally return 403 with a message like:
    // “Direct enrollment creation is disabled. Please complete checkout and wait for admin verification.”
    if (response.success === false) {
      throw new Error(response.message || 'Direct enrollment creation is disabled. Please use checkout.');
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

