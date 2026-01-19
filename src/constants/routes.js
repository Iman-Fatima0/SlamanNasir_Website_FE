/**
 * Application routes constants
 */

export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  COURSE_DETAIL: (id) => `/courses/${id}`,
  INSTRUCTORS: '/instructors',
  INSTRUCTOR_DETAIL: (id) => `/instructors/${id}`,
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
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

