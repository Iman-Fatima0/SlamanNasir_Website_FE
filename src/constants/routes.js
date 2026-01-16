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
    COURSES: '/admin/courses',
    INSTRUCTORS: '/admin/instructors',
    ORDERS: '/admin/orders',
  },
};

