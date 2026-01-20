/**
 * Manual Payment Checkout Page
 * Flow:
 * 1. Check if user is logged in (GET /api/auth/me)
 * 2. If logged in: show "Welcome back, {name}" and checkout form
 * 3. If NOT logged in: show email → password flow
 *    - Email input with "Continue" button
 *    - On Continue: lock email, show password field
 *    - On password submit: login → show checkout form
 * 4. On checkout success: show "Payment under review" page
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CoursesService, StudentService, UploadService, AuthService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Button } from '@/components/common/Button';
import { FiEye, FiEyeOff, FiCheck, FiLock } from 'react-icons/fi';
import { ROUTES } from '@/constants';

export const CheckoutPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, login: authLogin } = useAuth();
  const queryClient = useQueryClient();

  // If user is not logged in, we deliberately stay on this page
  // and show the email → password flow instead of redirecting to /login.
  const isLoggedIn = isAuthenticated;
  const loggedInUser = user;

  // Order created via manual checkout on this page only
  const [submittedOrder, setSubmittedOrder] = useState(null);

  // Form state for email → password flow
  const [email, setEmail] = useState('');
  const [emailLocked, setEmailLocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (isLoggedIn && loggedInUser?.email && !email) {
      setEmail(loggedInUser.email);
      setEmailLocked(true);
    }
  }, [isLoggedIn, loggedInUser, email]);

  // Checkout form state (only shown when logged in)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    country: 'PK', // Default to Pakistan
    transactionReference: '',
    notes: '',
  });
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load course summary
  const { data, isLoading, error } = useQuery({
    queryKey: ['checkoutCourse', courseId],
    queryFn: () => CoursesService.getCourseById(courseId),
    enabled: !!courseId,
  });

  const course = data?.data?.course || data?.data;

  // Pre-fill user info if logged in
  useEffect(() => {
    if (isLoggedIn && loggedInUser && !form.firstName) {
      setForm((prev) => ({
        ...prev,
        firstName: loggedInUser.firstName || '',
        lastName: loggedInUser.lastName || '',
      }));
    }
  }, [isLoggedIn, loggedInUser, form.firstName]);

  // Login mutation (for email → password flow)
  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => AuthService.login({ email, password }),
    onSuccess: async (response) => {
      if (response.success) {
        // Delegate to auth context login so the whole app updates consistently
        const result = await authLogin(email, password);
        if (result?.success) {
          setLoginError('');
        }
      }
    },
    onError: (err) => {
      setLoginError(err.message || 'Incorrect email or password');
    },
  });

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: (payload) => StudentService.checkout(payload),
    onSuccess: (order) => {
      setSubmittedOrder(order);
      setErrorMessage('');
      setLoginError('');
      queryClient.invalidateQueries(['studentCourses']);
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to submit checkout. Please try again.');
    },
  });

  // Handle email Continue button
  const handleEmailContinue = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setLoginError('Please enter a valid email address');
      return;
    }
    setEmailLocked(true);
    setLoginError('');
  };

  // Handle password submit (login only, don't auto-checkout)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setLoginError('Please enter your password');
      return;
    }

    setLoginError('');
    loginMutation.mutate({ email, password });
  };

  // Handle OAuth login with courseId in state
  const handleOAuthLogin = (provider) => {
    if (!courseId) return;

    // Use AuthService methods which handle the correct backend URL
    // Backend expects: /api/auth/google?state=courseId
    switch (provider) {
      case 'google':
        AuthService.googleLogin(courseId);
        break;
      case 'facebook':
        AuthService.facebookLogin(courseId);
        break;
      case 'linkedin':
        AuthService.linkedinLogin(courseId);
        break;
      case 'apple':
        AuthService.appleLogin(courseId);
        break;
      default:
        return;
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadProof = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await UploadService.uploadImage(file);
      if (result?.success && result.data?.fullUrl) {
        setPaymentProofUrl(result.data.fullUrl);
      } else {
        throw new Error('Upload did not return a valid URL');
      }
    } catch (err) {
      globalThis.alert(`Failed to upload payment proof: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = null; // Clear file input
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setErrorMessage('Please log in to complete checkout');
      return;
    }
    if (!form.firstName || !form.lastName || !form.country) {
      setErrorMessage('Please fill in all required billing fields');
      return;
    }
    if (!courseId) return;

    const payload = {
      courseId,
      paymentProofUrl: paymentProofUrl || undefined,
      transactionReference: form.transactionReference || undefined,
      notes: form.notes || undefined,
    };

    checkoutMutation.mutate(payload);
  };

  const formatPrice = (price, currency = 'USD') => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(price || 0);
    } catch {
      return `$${price || 0}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl w-full">
          <ErrorMessage
            message={error?.message || 'Course not found. Please go back and try again.'}
            className="mb-4"
          />
          <Link to={ROUTES.COURSES}>
            <Button variant="primary">Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  // After successful checkout, show thank-you / awaiting verification state
  if (submittedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg border border-stroke p-8">
          <h1 className="text-2xl font-bold text-font-primary mb-4">
            Thank you! Your payment is under review.
          </h1>
          <p className="text-gray-700 mb-4">
            We&apos;ve received your manual payment submission for:
          </p>
          <div className="mb-4 border border-stroke rounded-lg p-4 bg-gray-50">
            <div className="font-semibold text-font-primary mb-1">
              {submittedOrder.course?.title || course.title}
            </div>
            {submittedOrder.course?.subtitle && (
              <div className="text-sm text-gray-600">
                {submittedOrder.course.subtitle}
              </div>
            )}
            <div className="mt-2 text-sm text-gray-700">
              Order ID: <span className="font-mono">{submittedOrder.id}</span>
            </div>
            <div className="mt-1 text-sm text-gray-700">
              Amount: {formatPrice(submittedOrder.amount, submittedOrder.currency)}
            </div>
          </div>
          <p className="text-gray-700 mb-6">
            Our team will verify your payment. Once approved, your enrollment will be
            activated and the course will appear in your dashboard under &quot;My Courses&quot;.
          </p>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => navigate(ROUTES.DASHBOARD)}>
              Go to Dashboard
            </Button>
            <Link to={ROUTES.COURSES}>
              <Button variant="outline">Browse More Courses</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Course summary - matching design */}
          <div className="bg-white rounded-2xl shadow-sm border border-stroke p-6">
            {/* Brand header */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-font-primary">Salman Nasir</h2>
            </div>

            {/* Course image */}
            {course.thumbnail && (
              <div className="rounded-lg overflow-hidden mb-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Course title */}
            <h3 className="text-xl font-bold text-font-primary mb-2">
              {course.title}
            </h3>

            {/* Course description */}
            {course.subtitle && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {course.subtitle}
              </p>
            )}

            {/* Pricing */}
            <div className="space-y-2 border-t border-stroke pt-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">One-time payment</span>
                <span className="text-lg font-semibold text-font-primary">
                  {formatPrice(course.price, course.currency || 'USD')}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-stroke">
                <span className="text-base font-semibold text-font-primary">Total</span>
                <span className="text-lg font-bold text-font-primary">
                  {formatPrice(course.price, course.currency || 'USD')}
                </span>
              </div>
            </div>

            {/* Support link */}
            <div className="mt-6 pt-4 border-t border-stroke">
              <p className="text-sm text-gray-600">
                Need help placing your order?{' '}
                <Link to="/contact" className="text-primary hover:underline">
                  Contact us
                </Link>
              </p>
            </div>
          </div>

          {/* Right: Checkout form - matching design */}
          <div className="bg-white rounded-2xl shadow-sm border border-stroke p-6">
            <h1 className="text-2xl font-bold text-font-primary mb-6" style={{ fontFamily: "'Imprima', 'Inter', system-ui, sans-serif" }}>
              Complete purchase to start learning
            </h1>

            {/* If logged in: show welcome message */}
            {isLoggedIn && loggedInUser && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-900">
                  Welcome back, <span className="font-semibold">{loggedInUser.firstName || loggedInUser.email}</span>!
                </p>
              </div>
            )}

            {/* If NOT logged in: show email → password flow */}
            {!isLoggedIn && (
              <div className="mb-6 space-y-4">
                {/* Social login buttons - Google only */}
                <div>
                  <p className="text-sm text-gray-600 mb-3">Sign in with</p>
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('google')}
                      className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      aria-label="Sign in with Google"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stroke"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* Account info / Email input */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: "'Imprima', 'Inter', system-ui, sans-serif" }}>
                    Account info
                  </h3>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setLoginError('');
                        }}
                        disabled={emailLocked}
                        className={`w-full px-3 py-2 border ${
                          emailLocked ? 'border-emerald-300 bg-emerald-50' : 'border-stroke'
                        } rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                          emailLocked ? 'pr-10' : ''
                        }`}
                        placeholder="Email"
                      />
                      {emailLocked && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <FiCheck className="text-emerald-600" size={18} />
                        </div>
                      )}
                    </div>
                    {!emailLocked && (
                      <button
                        type="button"
                        onClick={handleEmailContinue}
                        className="mt-2 w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </div>

                {/* Password input (shown after email is locked) */}
                {emailLocked && (
                  <div>
                    <p className="text-sm text-gray-700 mb-3">
                      Welcome back! Enter your password to continue.
                    </p>
                    <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setLoginError('');
                        }}
                        className="w-full px-3 py-2 pr-10 border border-stroke rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your password"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                    <form onSubmit={handlePasswordSubmit} className="mt-2">
                      <button
                        type="submit"
                        disabled={loginMutation.isLoading}
                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        {loginMutation.isLoading ? 'Signing in...' : 'Continue'}
                      </button>
                    </form>
                    {loginError && (
                      <div className="mt-2 text-sm text-red-600">{loginError}</div>
                    )}
                    <div className="mt-3 text-sm">
                      <Link
                        to={ROUTES.LOGIN}
                        className="text-primary hover:underline"
                      >
                        Need help signing in?
                      </Link>
                      {' • '}
                      <Link
                        to={ROUTES.SIGNUP}
                        className="text-primary hover:underline"
                      >
                        Create account
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Checkout form */}
            {true && (
              <>
              {errorMessage && (
                <div className="mb-4">
                  <ErrorMessage message={errorMessage} />
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  {/* Billing info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: "'Imprima', 'Inter', system-ui, sans-serif" }}>
                      Billing info
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
                          First name *
                        </label>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-stroke rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Last name *
                        </label>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-stroke rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Last name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Country *
                        </label>
                        <select
                          value={form.country}
                          onChange={(e) => handleChange('country', e.target.value)}
                          className="w-full px-3 py-2 border border-stroke rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Select country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="PK">Pakistan</option>
                          <option value="SA">Saudi Arabia</option>
                          <option value="AE">United Arab Emirates</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Payment method section (manual payment, no card form) */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Imprima', 'Inter', system-ui, sans-serif" }}>Payment method</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FiLock size={12} /> Secured
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      This is a manual payment checkout. Please send the course fee to the
                      designated account, then upload a screenshot or receipt below. Our team
                      will verify your payment within 24–48 hours.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Payment proof (image)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadProof}
                          disabled={uploading}
                          className="block w-full text-sm text-gray-700"
                        />
                        {paymentProofUrl && (
                          <p className="mt-2 text-xs text-emerald-700">
                            Payment proof uploaded successfully.
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Transaction reference (optional)
                        </label>
                        <input
                          type="text"
                          value={form.transactionReference}
                          onChange={(e) => handleChange('transactionReference', e.target.value)}
                          className="w-full px-3 py-2 border border-stroke rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="e.g. bank reference number"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Notes (optional)
                        </label>
                        <textarea
                          rows={3}
                          value={form.notes}
                          onChange={(e) => handleChange('notes', e.target.value)}
                          className="w-full px-3 py-2 border border-stroke rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Any additional information for the admin..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={checkoutMutation.isLoading || uploading}
                    >
                      {checkoutMutation.isLoading ? 'Submitting...' : 'Complete purchase'}
                    </Button>
                    <p className="mt-3 text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                      <FiLock size={12} />
                      All transactions are secure and encrypted
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
