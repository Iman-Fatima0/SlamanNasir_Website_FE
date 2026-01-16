/**
 * OAuth Callback Page - handles OAuth redirects
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ROUTES } from '@/constants';

export const OAuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token and user from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to dashboard
        navigate(ROUTES.DASHBOARD);
      } catch (error) {
        console.error('Error parsing OAuth callback:', error);
        navigate(ROUTES.LOGIN);
      }
    } else {
      // No token, redirect to login
      navigate(ROUTES.LOGIN);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;

