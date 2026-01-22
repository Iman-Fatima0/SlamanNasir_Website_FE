/**
 * Reset Password Page
 * Allows users to reset their password using a token from email
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthService } from '@/services';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ROUTES } from '@/constants';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setTokenError('Invalid reset link. Please request a new password reset.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.resetPassword(token, password);

      if (response.success) {
        // Auto-login: Store token and user data
        const authToken = response.data?.token;
        const user = response.data?.user;

        if (authToken && user) {
          // Store token and user in localStorage
          localStorage.setItem('token', authToken);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Refresh the page to update auth context (simpler than manual context update)
          // The AuthContext will pick up the token from localStorage on reload
          window.location.href = ROUTES.DASHBOARD;
        } else {
          // If no token/user in response, just redirect to login
          navigate(ROUTES.LOGIN);
        }
      } else {
        setError(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      // Handle validation errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const firstError = err.response.data.errors[0];
        setError(firstError.message || 'Validation error');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show error if token is missing
  if (tokenError || !token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12 md:py-16 px-4 -mt-16 pt-36 md:-mt-20 md:pt-40">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-font-primary leading-tight">
              Invalid Reset Link
            </h1>
            <p className="text-gray-600 text-base">{tokenError || 'This reset link is invalid or has expired.'}</p>
          </div>
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">
              Password reset links expire after 10 minutes. Please request a new one.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="w-full bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6 text-center
                  transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                  shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                  hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]"
              >
                Request New Reset Link
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm text-gray-500 hover:text-primary underline"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 md:py-16 px-4 -mt-16 pt-36 md:-mt-20 md:pt-40">
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-font-primary leading-tight">
            Reset Password
          </h1>
          <p className="text-gray-600 text-base">
            Enter your new password below.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {error && <ErrorMessage message={error} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-font-primary mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  minLength={8}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md text-font-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <small className="text-xs text-gray-500 mt-1 block">
                Password must be at least 8 characters long
              </small>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-font-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md text-font-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <small className="text-xs text-red-500 mt-1 block">
                  Passwords do not match
                </small>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || password.length < 8 || password !== confirmPassword}
              className="w-full bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              to={ROUTES.LOGIN}
              className="text-sm text-gray-500 hover:text-primary underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
