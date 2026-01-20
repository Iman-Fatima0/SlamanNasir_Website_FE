/**
 * OAuth Callback Page - handles OAuth redirects
 * After Google login:
 * - Saves token + user
 * - Refreshes auth context
 * - If courseId present → send user back to checkout page to complete payment
 *   (NO automatic checkout here)
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ROUTES } from '@/constants';

export const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [status, setStatus] = useState('Processing sign in...');

  useEffect(() => {
    const handleCallback = async () => {
      // Extract token, user, and courseId from URL params
      const urlParams = new URLSearchParams(globalThis.location.search);
      const token = urlParams.get('token');
      const userParam = urlParams.get('user');
      const courseId = urlParams.get('courseId') || urlParams.get('state'); // Backend may send as courseId or state

      if (!token || !userParam) {
        setStatus('Authentication failed. Redirecting...');
        setTimeout(() => navigate(ROUTES.LOGIN), 2000);
        return;
      }

      try {
        // Parse and store user data
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Refresh auth context
        await refreshAuth();

        // If courseId is present, send user back to checkout to complete payment
        if (courseId) {
          setStatus('Redirecting to checkout to complete payment...');
          navigate(ROUTES.CHECKOUT(courseId), { replace: true });
        } else {
          // No courseId, just redirect to dashboard
          setStatus('Redirecting to dashboard...');
          navigate(ROUTES.DASHBOARD, { replace: true });
        }
      } catch (error) {
        console.error('Error parsing OAuth callback:', error);
        setStatus('Error processing callback. Redirecting...');
        setTimeout(() => navigate(ROUTES.LOGIN), 2000);
      }
    };

    handleCallback();
  }, [navigate, refreshAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
