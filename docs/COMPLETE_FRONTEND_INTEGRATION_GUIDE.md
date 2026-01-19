# Complete Frontend Integration Guide

## 📋 Overview

This document contains **everything** the frontend team needs to integrate with the backend API for the Arabic Course Website.

---

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env` file in the project root:

```env
# Development
VITE_API_URL=http://localhost:3000/api

# Production (set during deployment)
# VITE_API_URL=https://your-domain.com/api
```

### 2. API Base URL Configuration

**Development:** `http://localhost:3000/api`  
**Production:** Set via `VITE_API_URL` environment variable

**Note:** In development, the Vite proxy forwards `/api` requests to `http://localhost:3000/api`.

---

## 🔐 Authentication

### Authentication Flow

1. User logs in or signs up
2. Backend returns JWT token in response
3. Store token in `localStorage` with key `'token'`
4. Include token in all protected requests: `Authorization: Bearer <token>`
5. On 401 errors, redirect to login page

### Token Storage

```javascript
// After successful login/signup
localStorage.setItem('token', response.data.token);

// In API requests (handled automatically by apiClient)
// Header: Authorization: Bearer <token>

// On logout
localStorage.removeItem('token');
```

### Authentication Endpoints

#### Sign Up
```javascript
POST /auth/signup
Body: {
  name: string,
  email: string,
  password: string
}
Response: {
  success: true,
  data: {
    token: string,
    user: User
  }
}
```

#### Login
```javascript
POST /auth/login
Body: {
  email: string,
  password: string
}
Response: {
  success: true,
  data: {
    token: string,
    user: User
  }
}
```

#### Get Current User
```javascript
GET /auth/me
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  data: {
    user: User
  }
}
```

#### OAuth Login
```javascript
// Redirects to OAuth provider
GET /auth/google
GET /auth/facebook
GET /auth/linkedin
GET /auth/apple

// OAuth callback handled by backend
// Redirects to frontend with token
```

#### Forgot Password
```javascript
POST /auth/forgot-password
Body: {
  email: string
}
Response: {
  success: true,
  message: "Password reset email sent"
}
```

#### Reset Password
```javascript
POST /auth/reset-password
Body: {
  token: string,
  password: string
}
Response: {
  success: true,
  message: "Password reset successful"
}
```

---

## 📚 API Endpoints Reference

### Public Endpoints (No Auth Required)

#### Courses

**Get All Courses**
```javascript
GET /courses
Query Params:
  - page: number (default: 1)
  - limit: number (default: 12)
  - level: string (Beginner | Intermediate | Advanced)
  - language: string
  - search: string
  - isPublished: boolean (default: true)
  - instructorId: number

Response: {
  success: true,
  data: {
    courses: Course[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}
```

**Get Course by ID**
```javascript
GET /courses/:id

Response: {
  success: true,
  data: {
    course: Course
  }
}
```

#### Instructors

**Get All Instructors**
```javascript
GET /instructors
Query Params:
  - page: number (default: 1)
  - limit: number (default: 12)
  - search: string

Response: {
  success: true,
  data: {
    instructors: Instructor[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}
```

**Get Instructor by ID**
```javascript
GET /instructors/:id
Query Params:
  - includeCourses: boolean (default: false)

Response: {
  success: true,
  data: {
    instructor: Instructor,
    courses?: Course[]
  }
}
```

---

### Student Endpoints (Auth Required)

#### Enrollments

**Get Student Enrollments**
```javascript
GET /student/enrollments
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    enrollments: Enrollment[]
  }
}
```

**Create Enrollment**
```javascript
POST /student/enrollments
Headers: Authorization: Bearer <token>
Body: {
  courseId: number
}

Response: {
  success: true,
  data: {
    enrollment: Enrollment
  }
}
```

**Get Enrollment by ID**
```javascript
GET /student/enrollments/:id
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    enrollment: Enrollment
  }
}
```

#### Progress

**Get Course Progress**
```javascript
GET /student/progress/:courseId
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    progress: Progress
  }
}
```

**Update Lesson Progress**
```javascript
PUT /student/progress/:courseId/lessons/:lessonId
Headers: Authorization: Bearer <token>
Body: {
  completed: boolean
}

Response: {
  success: true,
  data: {
    progress: Progress
  }
}
```

**Submit Quiz**
```javascript
POST /student/progress/:courseId/quizzes/:quizId
Headers: Authorization: Bearer <token>
Body: {
  answers: { [questionId: string]: any }
}

Response: {
  success: true,
  data: {
    score: number,
    passed: boolean,
    result: QuizResult
  }
}
```

#### Certificates

**Get Student Certificates**
```javascript
GET /student/certificates
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    certificates: Certificate[]
  }
}
```

**Get Certificate by ID**
```javascript
GET /student/certificates/:id
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    certificate: Certificate
  }
}
```

---

### Instructor Endpoints (Instructor Role Required)

#### Analytics

**Get Instructor Analytics**
```javascript
GET /instructor/analytics
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    overview: {
      totalCourses: number,
      totalStudents: number,
      totalRevenue: number
    },
    courseAnalytics: CourseAnalytics[]
  }
}
```

**Get Course Analytics**
```javascript
GET /instructor/analytics/courses/:courseId
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    analytics: CourseAnalytics
  }
}
```

#### Courses

**Get Instructor's Courses**
```javascript
GET /instructor/courses
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    courses: Course[]
  }
}
```

**Update Course**
```javascript
PUT /instructor/courses/:id
Headers: Authorization: Bearer <token>
Body: {
  title?: string,
  description?: string,
  // ... other course fields
}

Response: {
  success: true,
  data: {
    course: Course
  }
}
```

#### Students

**Get Course Students**
```javascript
GET /instructor/courses/:courseId/students
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    students: Student[]
  }
}
```

**Get Student Progress**
```javascript
GET /instructor/courses/:courseId/students/:studentId/progress
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    progress: Progress
  }
}
```

---

### Admin Endpoints (Admin Role Required)

#### Dashboard Statistics

**Get Dashboard Stats**
```javascript
GET /admin/dashboard/stats
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    totalRevenue: number,
    totalUsers: number,
    totalOrders: number,
    refundRate: number,
    revenueTrend: { direction: "up" | "down", value: "12%" },
    usersTrend: { direction: "up" | "down", value: "5%" },
    ordersTrend: { direction: "up" | "down", value: "8%" },
    refundRateTrend: { direction: "up" | "down", value: "0.5%" },
    revenueData: [{ date: "Jan", revenue: 45000 }, ...],
    enrollmentsData: [{ course: "React 101", enrollments: 120 }, ...],
    recentOrders: Order[]
  }
}
```

See `docs/BACKEND_API_SPEC_ADMIN_DASHBOARD.md` for complete dashboard stats specification.

#### Users Management

**Get All Users**
```javascript
GET /admin/users
Headers: Authorization: Bearer <token>
Query Params:
  - page: number (default: 1)
  - limit: number (default: 10)
  - search: string
  - isActive: boolean

Response: {
  success: true,
  data: {
    users: User[],
    pagination: Pagination
  }
}
```

**Get User by ID**
```javascript
GET /admin/users/:id
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    user: User
  }
}
```

**Update User**
```javascript
PUT /admin/users/:id
Headers: Authorization: Bearer <token>
Body: {
  name?: string,
  email?: string,
  isActive?: boolean,
  role?: "student" | "instructor" | "admin"
}

Response: {
  success: true,
  data: {
    user: User
  }
}
```

**Delete User**
```javascript
DELETE /admin/users/:id
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  message: "User deleted successfully"
}
```

#### Courses Management

**Get All Courses (Admin)**
```javascript
GET /admin/courses
Headers: Authorization: Bearer <token>
Query Params:
  - page: number
  - limit: number
  - search: string

Response: {
  success: true,
  data: {
    courses: Course[],
    pagination: Pagination
  }
}
```

**Create Course**
```javascript
POST /admin/courses
Headers: Authorization: Bearer <token>
Body: {
  title: string,
  description: string,
  price: number,
  instructorId: number,
  level: "Beginner" | "Intermediate" | "Advanced",
  language: string,
  thumbnailUrl: string,
  isPublished: boolean,
  // ... other course fields
}

Response: {
  success: true,
  data: {
    course: Course
  }
}
```

**Update Course**
```javascript
PUT /admin/courses/:id
Headers: Authorization: Bearer <token>
Body: {
  // Course fields to update
}

Response: {
  success: true,
  data: {
    course: Course
  }
}
```

**Delete Course**
```javascript
DELETE /admin/courses/:id
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  message: "Course deleted successfully"
}
```

#### Instructors Management

**Get All Instructors (Admin)**
```javascript
GET /admin/instructors
Headers: Authorization: Bearer <token>
Query Params:
  - page: number
  - limit: number
  - search: string

Response: {
  success: true,
  data: {
    instructors: Instructor[],
    pagination: Pagination
  }
}
```

**Create Instructor**
```javascript
POST /admin/instructors
Headers: Authorization: Bearer <token>
Body: {
  name: string,
  email: string,
  bio: string,
  avatarUrl: string,
  // ... other instructor fields
}

Response: {
  success: true,
  data: {
    instructor: Instructor
  }
}
```

**Update Instructor**
```javascript
PUT /admin/instructors/:id
Headers: Authorization: Bearer <token>
Body: {
  // Instructor fields to update
}

Response: {
  success: true,
  data: {
    instructor: Instructor
  }
}
```

**Delete Instructor**
```javascript
DELETE /admin/instructors/:id
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  message: "Instructor deleted successfully"
}
```

#### Orders Management

**Get All Orders**
```javascript
GET /admin/orders
Headers: Authorization: Bearer <token>
Query Params:
  - page: number (default: 1)
  - limit: number (default: 10)
  - status: string (completed | pending | cancelled | refunded)
  - search: string

Response: {
  success: true,
  data: {
    orders: Order[],
    pagination: Pagination
  }
}
```

**Get Order by ID**
```javascript
GET /admin/orders/:id
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  data: {
    order: Order
  }
}
```

**Update Order Status**
```javascript
PUT /admin/orders/:id/status
Headers: Authorization: Bearer <token>
Body: {
  status: "completed" | "pending" | "cancelled" | "refunded"
}

Response: {
  success: true,
  data: {
    order: Order
  }
}
```

---

## 📦 Data Structures

### User
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Course
```typescript
interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructor: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  thumbnailUrl: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
  rating?: number;
  reviewCount?: number;
  enrollmentCount?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Instructor
```typescript
interface Instructor {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  title?: string;
  coursesCount?: number;
  studentsCount?: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Order
```typescript
interface Order {
  id: number;
  user: User;
  course: Course;
  status: "completed" | "pending" | "cancelled" | "refunded";
  totalAmount: number;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Enrollment
```typescript
interface Enrollment {
  id: number;
  course: Course;
  progress: number; // Percentage 0-100
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}
```

### Progress
```typescript
interface Progress {
  courseId: number;
  course: Course;
  completedLessons: number[];
  completedQuizzes: number[];
  overallProgress: number; // Percentage 0-100
  lastAccessedAt: string;
}
```

---

## 🔧 API Client Implementation

### Base API Client (src/services/api.js)

```javascript
import axios from 'axios';

class ApiClient {
  constructor() {
    const baseURL = import.meta.env.PROD
      ? (import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
      : '/api';

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Handle 401 Unauthorized
          if (error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }

          const apiError = {
            success: false,
            message: error.response.data?.message || 'An error occurred',
            error: error.response.data?.error,
            errors: error.response.data?.errors,
          };
          return Promise.reject(apiError);
        }

        if (error.request) {
          return Promise.reject({
            success: false,
            message: 'Network error. Please check your connection.',
          });
        }

        return Promise.reject({
          success: false,
          message: error.message || 'An unexpected error occurred',
        });
      }
    );
  }

  async get(url, config) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url, data, config) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url, data, config) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete(url, config) {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
```

### Service Classes Example

**Auth Service (src/services/auth.service.js)**
```javascript
import { apiClient } from './api.js';
import { API_ENDPOINTS } from '@/constants';

export class AuthService {
  static async signup(data) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, data);
    if (response.success === false) {
      throw new Error(response.message || 'Failed to sign up');
    }
    return response;
  }

  static async login(data) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    if (response.success === false) {
      throw new Error(response.message || 'Failed to login');
    }
    return response;
  }

  static async getMe() {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    if (response.success === false) {
      throw new Error(response.message || 'Failed to get user data');
    }
    return response;
  }
}
```

---

## ⚠️ Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: { [field: string]: string[] };
}
```

### Example Error Handling

```javascript
try {
  const response = await CoursesService.getAllCourses();
  // Handle success
} catch (error) {
  if (error.message) {
    // Display error.message to user
    console.error(error.message);
  }
  if (error.errors) {
    // Handle field-specific errors
    Object.keys(error.errors).forEach(field => {
      console.error(`${field}: ${error.errors[field]}`);
    });
  }
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔒 Protected Routes

### Route Protection Example

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin route protection
export const AdminRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};
```

---

## 📱 React Query Integration

### Setup React Query

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Wrap your app
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

### Using React Query

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CoursesService } from '@/services';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['courses', filters],
  queryFn: () => CoursesService.getAllCourses(filters),
});

// Mutations
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (courseData) => CoursesService.createCourse(courseData),
  onSuccess: () => {
    queryClient.invalidateQueries(['courses']);
  },
});
```

---

## ✅ Implementation Checklist

- [ ] Set up environment variables
- [ ] Create API client with interceptors
- [ ] Implement authentication service
- [ ] Implement courses service
- [ ] Implement instructors service
- [ ] Implement admin service (if admin)
- [ ] Set up React Query
- [ ] Implement protected routes
- [ ] Handle errors globally
- [ ] Test all endpoints
- [ ] Implement loading states
- [ ] Implement error states

---

## 🧪 Test Credentials

### Admin
```
Email: admin@elcanadi.com
Password: Admin@123456
Role: admin
```

### Student
```
Email: student1@example.com
Password: Student123!
Role: student
```

### Instructor
```
Email: instructor1@example.com
Password: Instructor123!
Role: instructor
```

---

## 📚 Additional Resources

- **Admin Dashboard API Spec:** `docs/BACKEND_API_SPEC_ADMIN_DASHBOARD.md`
- **Admin Dashboard Requirements:** `docs/ADMIN_DASHBOARD_BACKEND_REQUIREMENTS.md`
- **Quick Start Guide:** `docs/FRONTEND_QUICK_START.md`

---

## 💡 Best Practices

1. **Always handle errors** - Use try-catch or React Query error handling
2. **Show loading states** - Use React Query `isLoading` or custom loading states
3. **Validate data** - Use TypeScript types or runtime validation
4. **Cache intelligently** - Use React Query for automatic caching
5. **Handle authentication** - Check token validity and handle 401 errors
6. **Transform data** - Use data mappers to transform backend data to frontend format
7. **Test endpoints** - Use provided test credentials to verify functionality

---

**Last Updated:** 2024-01-15  
**Version:** 1.0.0

