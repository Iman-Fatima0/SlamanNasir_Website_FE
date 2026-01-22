/**
 * Application routes constants
 */

export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  COURSE_DETAIL: (id) => `/courses/${id}`,
  INSTRUCTOR_DETAIL: (id) => `/instructors/${id}`,
  CHECKOUT: (courseId) => `/checkout/${courseId}`,
  ABOUT: '/about-salman',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  COOKIES: '/cookies',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  USER: {
    PROFILE: '/dashboard/profile',
    COURSES: '/dashboard/courses',
    PURCHASES: '/dashboard/purchases',
    SETTINGS: '/dashboard/settings',
    COURSE_LEARNING: (id) => `/dashboard/courses/${id}/learn`,
  },
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    USER_PROFILE: (id) => `/admin/users/${id}`,
    COURSES: '/admin/courses',
    INSTRUCTORS: '/admin/instructors',
    ORDERS: '/admin/orders',
    ANALYTICS: '/admin/analytics',
    MARKETING: '/admin/marketing',
    SETTINGS: '/admin/settings',
  },
};

