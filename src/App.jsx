/**
 * Main App component with routing
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollIndicator } from '@/components/common/ScrollIndicator';
import { HomePage } from '@/pages/HomePage';
import { CoursesPage } from '@/pages/CoursesPage';
import { CourseDetailPage } from '@/pages/CourseDetailPage';
import { InstructorsPage } from '@/pages/InstructorsPage';
import { InstructorDetailPage } from '@/pages/InstructorDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { OAuthCallbackPage } from '@/pages/OAuthCallbackPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminCoursesPage } from '@/pages/admin/AdminCoursesPage';
import { AdminInstructorsPage } from '@/pages/admin/AdminInstructorsPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AuthProvider } from '@/context/AuthContext';
import { ROUTES } from '@/constants';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <ScrollIndicator />
            <main className="flex-grow">
              <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.COURSES} element={<CoursesPage />} />
                <Route path={ROUTES.COURSE_DETAIL(':id')} element={<CourseDetailPage />} />
                <Route path={ROUTES.INSTRUCTORS} element={<InstructorsPage />} />
                <Route path={ROUTES.INSTRUCTOR_DETAIL(':id')} element={<InstructorDetailPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
                <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                <Route path="/auth/callback" element={<OAuthCallbackPage />} />
                {/* Admin Routes */}
                <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboardPage />} />
                <Route path={ROUTES.ADMIN.USERS} element={<AdminUsersPage />} />
                <Route path={ROUTES.ADMIN.COURSES} element={<AdminCoursesPage />} />
                <Route path={ROUTES.ADMIN.INSTRUCTORS} element={<AdminInstructorsPage />} />
                <Route path={ROUTES.ADMIN.ORDERS} element={<AdminOrdersPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

