/**
 * User Dashboard Page component - Redirects to profile page
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ROUTES } from '@/constants';

const DashboardContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to profile page
    navigate(ROUTES.USER.PROFILE, { replace: true });
  }, [navigate]);

  return null;
};

export const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};

export default DashboardPage;
