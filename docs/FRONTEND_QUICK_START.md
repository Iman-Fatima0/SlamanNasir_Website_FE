# Frontend Quick Start Guide

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

---

## 🔐 Authentication Example

### Login Flow

```javascript
import { AuthService } from '@/services';
import { useNavigate } from 'react-router-dom';

const handleLogin = async (email, password) => {
  try {
    const response = await AuthService.login({ email, password });
    
    // Store token
    localStorage.setItem('token', response.data.token);
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error.message);
    // Show error to user
  }
};
```

### Signup Flow

```javascript
import { AuthService } from '@/services';

const handleSignup = async (name, email, password) => {
  try {
    const response = await AuthService.signup({
      name,
      email,
      password
    });
    
    // Store token
    localStorage.setItem('token', response.data.token);
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Signup failed:', error.message);
    // Show error to user
  }
};
```

---

## 📚 Data Fetching Examples

### Fetch Courses (React Query)

```javascript
import { useQuery } from '@tanstack/react-query';
import { CoursesService } from '@/services';

const CoursesPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => CoursesService.getAllCourses(),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      {data?.data?.courses?.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};
```

### Fetch Featured Courses

```javascript
import { useQuery } from '@tanstack/react-query';
import { CoursesService } from '@/services';

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: () => CoursesService.getFeaturedCourses(6),
  });

  return (
    <div>
      {data?.data?.courses?.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};
```

### Fetch Single Course

```javascript
import { useQuery } from '@tanstack/react-query';
import { CoursesService } from '@/services';
import { useParams } from 'react-router-dom';

const CourseDetailPage = () => {
  const { id } = useParams();
  
  const { data, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => CoursesService.getCourseById(id),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;

  const course = data?.data?.course;
  
  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Price: ${course.price}</p>
    </div>
  );
};
```

---

## 🔒 Protected Route Example

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Usage
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

---

## 🎯 Admin Dashboard Example

```javascript
import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services';

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => AdminService.getDashboardStats(),
  });

  const stats = data || {};

  return (
    <div>
      <KPICard
        title="Total Revenue"
        value={`$${stats.totalRevenue || 0}`}
        trend={stats.revenueTrend?.direction}
        trendValue={stats.revenueTrend?.value}
      />
      
      <KPICard
        title="Active Students"
        value={stats.totalUsers || 0}
        trend={stats.usersTrend?.direction}
        trendValue={stats.usersTrend?.value}
      />
      
      <RevenueChart data={stats.revenueData} />
      <EnrollmentsChart data={stats.enrollmentsData} />
    </div>
  );
};
```

---

## 📋 Quick Reference Card

### API Base URL
```
Development: http://localhost:3000/api
Production: Set via VITE_API_URL
```

### Authentication
```javascript
// Login
POST /auth/login
Body: { email, password }

// Signup
POST /auth/signup
Body: { name, email, password }

// Get current user
GET /auth/me
Headers: Authorization: Bearer <token>
```

### Courses
```javascript
// Get all courses
GET /courses?page=1&limit=12&level=Beginner

// Get course by ID
GET /courses/:id

// Get featured courses
GET /courses?limit=6&isPublished=true
```

### Instructors
```javascript
// Get all instructors
GET /instructors?page=1&limit=12

// Get instructor by ID
GET /instructors/:id
```

### Admin (Admin Role Required)
```javascript
// Dashboard stats
GET /admin/dashboard/stats

// Users
GET /admin/users
GET /admin/users/:id
PUT /admin/users/:id
DELETE /admin/users/:id

// Courses
GET /admin/courses
POST /admin/courses
PUT /admin/courses/:id
DELETE /admin/courses/:id

// Orders
GET /admin/orders
GET /admin/orders/:id
PUT /admin/orders/:id/status
```

---

## 🧪 Test Credentials

### Admin
```
Email: admin@elcanadi.com
Password: Admin@123456
```

### Student
```
Email: student1@example.com
Password: Student123!
```

---

## ⚠️ Common Issues & Solutions

### Issue: CORS Error
**Solution:** Ensure backend CORS is configured to allow frontend origin.

### Issue: 401 Unauthorized
**Solution:** Check if token is stored in localStorage and included in request headers.

### Issue: Network Error
**Solution:** Verify backend server is running and API base URL is correct.

### Issue: Token Expired
**Solution:** Implement token refresh or redirect to login on 401 errors.

---

## 📚 Next Steps

1. Read the **Complete Frontend Integration Guide** (`COMPLETE_FRONTEND_INTEGRATION_GUIDE.md`)
2. Review API endpoints in the main guide
3. Check admin dashboard API spec if working on admin features
4. Test with provided credentials
5. Implement your features using the examples above

---

**Need more details?** See `COMPLETE_FRONTEND_INTEGRATION_GUIDE.md` for comprehensive documentation.

