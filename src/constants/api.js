/**
 * API endpoints and configuration constants
 */

export const API_ENDPOINTS = {
  // Courses
  COURSES: '/courses',
  COURSE_BY_ID: (id) => `/courses/${id}`,
  
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    GOOGLE: '/auth/google',
    FACEBOOK: '/auth/facebook',
    LINKEDIN: '/auth/linkedin',
    APPLE: '/auth/apple',
  },
  
  // Instructors
  INSTRUCTORS: '/instructors',
  INSTRUCTOR_BY_ID: (id) => `/instructors/${id}`,
  
  // Student endpoints (auth required)
  STUDENT: {
    ENROLLMENTS: '/student/enrollments',
    ENROLLMENT_BY_ID: (id) => `/student/enrollments/${id}`,
    PROGRESS_BY_ENROLLMENT: (enrollmentId) => `/student/progress/${enrollmentId}`,
    PROGRESS_BY_COURSE: (courseId) => `/student/progress/${courseId}`, // Legacy support
    PROGRESS_LESSON: (courseId, lessonId) => `/student/progress/${courseId}/lessons/${lessonId}`,
    PROGRESS_QUIZ: (courseId, quizId) => `/student/progress/${courseId}/quizzes/${quizId}`,
    CERTIFICATES: '/student/certificates',
    CERTIFICATE_BY_ID: (id) => `/student/certificates/${id}`,
  },
  
  // Instructor endpoints (instructor role required)
  INSTRUCTOR: {
    ANALYTICS: '/instructor/analytics',
    COURSE_ANALYTICS: (courseId) => `/instructor/analytics/courses/${courseId}`,
    COURSES: '/instructor/courses',
    COURSE_BY_ID: (id) => `/instructor/courses/${id}`,
    COURSE_STUDENTS: (courseId) => `/instructor/courses/${courseId}/students`,
    STUDENT_PROGRESS: (courseId, studentId) => `/instructor/courses/${courseId}/students/${studentId}/progress`,
  },
  
  // Admin endpoints (admin role required)
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard/stats',
    USERS: '/admin/users',
    USER_BY_ID: (id) => `/admin/users/${id}`,
    COURSES: '/admin/courses',
    COURSE_BY_ID: (id) => `/admin/courses/${id}`,
    INSTRUCTORS: '/admin/instructors',
    INSTRUCTOR_BY_ID: (id) => `/admin/instructors/${id}`,
    ORDERS: '/admin/orders',
    ORDER_BY_ID: (id) => `/admin/orders/${id}`,
    ORDER_STATUS: (id) => `/admin/orders/${id}/status`,
    // Analytics endpoints
    ANALYTICS: {
      REVENUE: '/admin/analytics/revenue',
      COURSES: '/admin/analytics/courses',
      STUDENTS: '/admin/analytics/students',
      FUNNELS: '/admin/analytics/funnels',
    },
  },
};

export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  FEATURED_COURSES_LIMIT: 6,
  MAX_PAGE_SIZE: 100,
};

