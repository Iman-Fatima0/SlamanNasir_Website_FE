/**
 * Main App component with routing
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollIndicator } from '@/components/common/ScrollIndicator';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { ROUTES } from '@/constants';
import { HomePage } from '@/pages/HomePage';
import { CoursesPage } from '@/pages/CoursesPage';
import { CourseDetailPage } from '@/pages/CourseDetailPage';
import { AboutSalmanPage } from '@/pages/AboutSalmanPage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { TermsOfServicePage } from '@/pages/TermsOfServicePage';
import { CookiePolicyPage } from '@/pages/CookiePolicyPage';
import { InstructorDetailPage } from '@/pages/InstructorDetailPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { OAuthCallbackPage } from '@/pages/OAuthCallbackPage';
import { UserProfilePage } from '@/pages/user/UserProfilePage';
import { UserCoursesPage } from '@/pages/user/UserCoursesPage';
import { UserPurchasesPage } from '@/pages/user/UserPurchasesPage';
import { UserSettingsPage } from '@/pages/user/UserSettingsPage';
import { CourseLearningPage } from '@/pages/user/CourseLearningPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminCoursesPage } from '@/pages/admin/AdminCoursesPage';
import { AdminInstructorsPage } from '@/pages/admin/AdminInstructorsPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminMarketingPage } from '@/pages/admin/AdminMarketingPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminUserProfilePage } from '@/pages/admin/AdminUserProfilePage';
import { AuthProvider } from '@/context/AuthContext';
import { AdminRoute } from '@/components/common/AdminRoute';

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

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserDashboardRoute = location.pathname.startsWith('/dashboard');
  const isHomePage = location.pathname === ROUTES.HOME;
  const isCoursesPage = location.pathname === ROUTES.COURSES || location.pathname.startsWith(ROUTES.COURSE_DETAIL('').replace(':id', ''));
  const isAboutPage = location.pathname === ROUTES.ABOUT;
  const isAuthPage = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGNUP;
  const isInstructorDetailPage = location.pathname.startsWith('/instructors/');
  const isDashboardPage = location.pathname === ROUTES.DASHBOARD;
  const isCheckoutPage = location.pathname.startsWith('/checkout/');
  
  // Pages that extend background behind navbar don't need padding
  const pagesWithExtendedBackground = isHomePage || isCoursesPage || isAboutPage || isAuthPage || isInstructorDetailPage || isDashboardPage || isCheckoutPage;

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && !isUserDashboardRoute && <Header />}
      {!isAdminRoute && !isUserDashboardRoute && <ScrollIndicator />}
      <main className={`flex-grow ${!isAdminRoute && !isUserDashboardRoute && !pagesWithExtendedBackground ? 'pt-24' : ''}`}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.COURSES} element={<CoursesPage />} />
          <Route path={ROUTES.COURSE_DETAIL(':id')} element={<CourseDetailPage />} />
          <Route path={ROUTES.CHECKOUT(':courseId')} element={<CheckoutPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutSalmanPage />} />
          <Route path={ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />
          <Route path={ROUTES.TERMS} element={<TermsOfServicePage />} />
          <Route path={ROUTES.COOKIES} element={<CookiePolicyPage />} />
          {/* Use explicit path string here to avoid any issues with ROUTES helpers at route definition time */}
          <Route path="/instructors/:id" element={<InstructorDetailPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          {/* User Dashboard Routes */}
          <Route path={ROUTES.USER.PROFILE} element={<UserProfilePage />} />
          <Route path={ROUTES.USER.COURSES} element={<UserCoursesPage />} />
          <Route path={ROUTES.USER.COURSE_LEARNING(':id')} element={<CourseLearningPage />} />
          <Route path={ROUTES.USER.PURCHASES} element={<UserPurchasesPage />} />
          <Route path={ROUTES.USER.SETTINGS} element={<UserSettingsPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          {/* Admin Routes */}
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path={ROUTES.ADMIN.USERS} element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path={ROUTES.ADMIN.COURSES} element={<AdminRoute><AdminCoursesPage /></AdminRoute>} />
          <Route path={ROUTES.ADMIN.INSTRUCTORS} element={<AdminRoute><AdminInstructorsPage /></AdminRoute>} />
          <Route path={ROUTES.ADMIN.ORDERS} element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
          <Route path={ROUTES.ADMIN.ANALYTICS} element={<AdminRoute><AdminAnalyticsPage /></AdminRoute>} />
          <Route path={ROUTES.ADMIN.MARKETING} element={<AdminRoute><AdminMarketingPage /></AdminRoute>} />
          <Route path={ROUTES.ADMIN.SETTINGS} element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
          <Route path={ROUTES.ADMIN.USER_PROFILE(':id')} element={<AdminRoute><AdminUserProfilePage /></AdminRoute>} />
        </Routes>
      </main>
      {!isAdminRoute && !isUserDashboardRoute && <Footer />}
      {!isAdminRoute && !isUserDashboardRoute && <WhatsAppButton />}
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

