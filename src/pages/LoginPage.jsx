/**
 * Login Page component - Minimal Thinkific style
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthService } from '@/services';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ROUTES } from '@/constants';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate(ROUTES.DASHBOARD);
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    if (provider === 'google') AuthService.googleLogin();
    else if (provider === 'facebook') AuthService.facebookLogin();
    else if (provider === 'linkedin') AuthService.linkedinLogin();
    else if (provider === 'apple') AuthService.appleLogin();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 md:py-16 px-4 -mt-16 pt-36 md:-mt-20 md:pt-40">
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-font-primary leading-tight">
            Welcome!
          </h1>
          <p className="text-gray-600 text-base">Sign in to continue your learning journey</p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {error && <ErrorMessage message={error} className="mb-4" />}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-font-primary mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-font-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-font-primary mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-font-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Password"
              />
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-font-primary">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-primary underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button - Neumorphic Style */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign in with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            className="w-full relative overflow-hidden flex items-center justify-center py-2.5 px-6 rounded-[50px] border border-gray-300 text-sm font-medium text-gray-700 bg-white google-button-gradient-hover"
            aria-label="Sign in with Google"
          >
            <span className="button-content flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </span>
          </button>

          {/* Create Account Link */}
          <div className="text-center mt-8">
            <Link
              to={ROUTES.SIGNUP}
              className="text-sm text-gray-500 hover:text-primary underline"
            >
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
