/**
 * Forgot Password Page
 * Allows users to request a password reset link via email
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '@/services';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ROUTES } from '@/constants';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const response = await AuthService.forgotPassword(email.trim());

      if (response.success) {
        // Always show the same success message (security: don't reveal if email exists)
        setMessage('If the email exists, a password reset link has been sent. Please check your email inbox.');
        // Clear email field
        setEmail('');
        // Optionally redirect to login after showing message
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 5000);
      } else {
        setError(response.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      // Handle validation errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const firstError = err.response.data.errors[0];
        setError(firstError.message || 'Validation error');
      } else {
        setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 md:py-16 px-4 -mt-16 pt-36 md:-mt-20 md:pt-40">
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-font-primary leading-tight">
            Forgot Password?
          </h1>
          <p className="text-gray-600 text-base">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {error && <ErrorMessage message={error} className="mb-4" />}
          
          {message && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-emerald-900">{message}</p>
              <p className="text-xs text-emerald-700 mt-2">
                Redirecting to login page in a few seconds...
              </p>
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-font-primary mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-font-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="your@email.com"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                  transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                  shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                  hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                  focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

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

export default ForgotPasswordPage;
