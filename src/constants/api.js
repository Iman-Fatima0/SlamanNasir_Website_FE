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
  
  // Admin
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
  },
};

export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  FEATURED_COURSES_LIMIT: 6,
  MAX_PAGE_SIZE: 100,
};

