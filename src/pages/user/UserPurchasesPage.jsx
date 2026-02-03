/**
 * User Purchases Page
 */

import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { UserLayout } from '@/components/user/UserLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { StudentService, CoursesService } from '@/services';
import { FiShoppingBag, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

const formatCurrency = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount || 0);
  } catch {
    return `$${amount || 0}`;
  }
};

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString || 'N/A';
  }
};

const UserPurchasesContent = () => {
  const queryClient = useQueryClient();
  
  // Fetch orders (all purchase history - pending, approved, rejected)
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['studentOrders'],
    queryFn: () => StudentService.getOrders(),
    retry: false, // Don't retry if 404 (endpoint doesn't exist)
    enabled: true,
  });

  // Also fetch enrollments (approved purchases only) - fetch in parallel, not as fallback
  const { data: enrollmentsData, isLoading: enrollmentsLoading, error: enrollmentsError } = useQuery({
    queryKey: ['studentEnrollments'],
    queryFn: () => StudentService.getEnrollments(),
    retry: 1,
    retryDelay: 1000,
    enabled: true, // Always try to fetch enrollments
  });

  // Also fetch courses as a fallback - if enrollments/orders fail, we can still show courses
  const { data: coursesData } = useQuery({
    queryKey: ['studentCourses'],
    queryFn: () => StudentService.getCourses(),
    retry: 1,
    enabled: true, // Always try to fetch courses as fallback
  });

  const isLoading = ordersLoading || enrollmentsLoading;
  
  // Combine orders and enrollments to show all purchases
  // IMPORTANT: Purchase History shows ALL orders (pending + approved + rejected)
  // This appears immediately after purchase, even before admin approval
  let orders = [];
  const ordersMap = new Map();
  const enrollmentCourseIds = new Set(); // Track courses already added from enrollments
  
  // First, add all orders from orders endpoint (includes pending, approved, rejected)
  // This is the PRIMARY source - shows all purchases immediately after checkout
  // Only add if orders endpoint succeeded (ignore 404, but use data if available)
  if (ordersData && (!ordersError || ordersError?.status === 404)) {
    const ordersList = ordersData?.orders || ordersData?.data?.orders || [];
    ordersList.forEach(order => {
      if (order.id) {
        ordersMap.set(order.id, {
          id: order.id,
          course: order.course,
          courseId: order.courseId,
          amount: order.amount,
          currency: order.currency || 'USD',
          status: order.status || 'pending', // Default to pending if status not set
          createdAt: order.createdAt,
        });
        // Track course IDs from orders
        if (order.courseId) {
          enrollmentCourseIds.add(order.courseId);
        }
      }
    });
  }
  
  // Then, supplement with enrollments that don't have corresponding orders
  // This ensures we show all approved courses even if orders endpoint fails
  // CRITICAL: Always show enrollments in purchases, even if no order exists
  if (enrollmentsData && !enrollmentsError) {
    const enrollments = enrollmentsData?.enrollments || enrollmentsData?.data?.enrollments || [];
    enrollments.forEach(enrollment => {
      const orderId = enrollment.order?.id;
      const courseId = enrollment.courseId || enrollment.course?.id;
      
      // Skip if we already have this course from an order
      if (courseId && enrollmentCourseIds.has(courseId)) {
        return;
      }
      
      // If enrollment has an order ID, try to use it
      if (orderId && !ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          id: orderId,
          course: enrollment.course,
          courseId: courseId,
          amount: enrollment.order?.amount || enrollment.course?.price || 0,
          currency: enrollment.order?.currency || enrollment.course?.currency || 'USD',
          status: enrollment.order?.status || 'approved', // Enrollments imply approved
          createdAt: enrollment.order?.createdAt || enrollment.createdAt,
        });
        if (courseId) {
          enrollmentCourseIds.add(courseId);
        }
      } else if (courseId) {
        // If enrollment doesn't have order info but has course, create a purchase entry
        // Use enrollment ID as a key, but ensure we don't duplicate
        const tempId = `enrollment-${enrollment.id}`;
        if (!ordersMap.has(tempId) && !enrollmentCourseIds.has(courseId)) {
          ordersMap.set(tempId, {
            id: tempId,
            course: enrollment.course,
            courseId: courseId,
            amount: enrollment.course?.price || enrollment.order?.amount || 0,
            currency: enrollment.course?.currency || enrollment.order?.currency || 'USD',
            status: 'approved', // Enrollments imply approved
            createdAt: enrollment.createdAt || enrollment.order?.createdAt,
          });
          enrollmentCourseIds.add(courseId);
        }
      }
    });
  }
  
  // Fallback: If we have no orders/enrollments but have courses, show them as approved purchases
  // This ensures users always see their courses in purchases
  if (orders.length === 0 && coursesData?.courses && Array.isArray(coursesData.courses)) {
    coursesData.courses.forEach(course => {
      const courseId = course.id || course.courseId;
      if (courseId && !enrollmentCourseIds.has(courseId)) {
        const tempId = `course-${courseId}`;
        if (!ordersMap.has(tempId)) {
          ordersMap.set(tempId, {
            id: tempId,
            course: course,
            courseId: courseId,
            amount: course.price || 0,
            currency: course.currency || 'USD',
            status: 'approved', // Courses in "My Courses" are always approved
            createdAt: course.enrollment?.enrolledAt || course.enrollment?.createdAt || course.createdAt,
          });
          enrollmentCourseIds.add(courseId);
        }
      }
    });
  }
  
  // Build a lookup of courseId -> course from student courses (so we can show course name when order only has courseId)
  const coursesById = new Map();
  (coursesData?.courses || []).forEach((c) => {
    const id = c.id || c.courseId;
    if (id) coursesById.set(id, c);
  });
  // Also from enrollments (in case course details are there)
  (enrollmentsData?.enrollments || enrollmentsData?.data?.enrollments || []).forEach((en) => {
    const course = en.course;
    if (course) {
      const id = course.id || course.courseId || en.courseId;
      if (id && !coursesById.has(id)) coursesById.set(id, course);
    }
  });

  // Convert map to array and sort by date (newest first)
  orders = Array.from(ordersMap.values()).sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB - dateA;
  });

  // Enrich each order with course title/thumbnail when we have courseId but missing course details
  orders.forEach((order) => {
    const cid = order.courseId || order.course?.id;
    if (cid && !order.course?.title && coursesById.has(cid)) {
      const fullCourse = coursesById.get(cid);
      order.course = {
        ...(order.course || {}),
        id: fullCourse.id || cid,
        title: fullCourse.title,
        subtitle: fullCourse.subtitle,
        thumbnailUrl: fullCourse.thumbnailUrl || order.course?.thumbnailUrl,
      };
    }
  });

  // For any order still missing course details (e.g. previous purchases), fetch course by ID from public API
  const missingCourseIds = [...new Set(orders.filter((o) => (o.courseId || o.course?.id) && !o.course?.title).map((o) => o.courseId || o.course?.id))];
  const courseDetailQueries = useQueries({
    queries: missingCourseIds.map((id) => ({
      queryKey: ['courseForPurchase', id],
      queryFn: () => CoursesService.getCourseById(id),
      enabled: !!id,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    })),
  });
  const fetchedCoursesById = useMemo(() => {
    const m = new Map();
    courseDetailQueries.forEach((q) => {
      const id = q?.queryKey?.[1];
      if (q?.data?.data?.course && id) m.set(id, q.data.data.course);
    });
    return m;
  }, [courseDetailQueries]);

  // Determine error state: Only show error if both endpoints failed
  // If we have data from either source, don't show error
  const hasData = orders.length > 0;
  const ordersFailed = ordersError && ordersError?.status !== 404 && ordersError?.status !== undefined;
  const enrollmentsFailed = enrollmentsError && enrollmentsError?.status !== undefined;
  
  // Only show error if both failed AND we have no data
  const error = (!hasData && ordersFailed && enrollmentsFailed) 
    ? (ordersError?.status === 500 ? ordersError : enrollmentsError)
    : null;
  
  // Check if error is a 500 error
  const isServerError = error?.status === 500 || 
                        error?.response?.status === 500 ||
                        (error?.message && error.message.includes('Server error'));
  
  // Show warning if orders failed but we have enrollments data
  const showOrdersWarning = ordersFailed && hasData && enrollmentsData;

  const handleRetry = () => {
    queryClient.invalidateQueries(['studentOrders']);
    queryClient.invalidateQueries(['studentEnrollments']);
  };

  return (
    <UserLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">My Purchases</h1>
          <p className="text-gray-400 mt-2">View your purchase history</p>
          <p className="text-sm text-gray-500 mt-1">
            All purchases appear here immediately. Courses appear in "My Courses" only after admin approval.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-[#1A1D29] rounded-xl shadow-sm border border-gray-800 p-8">
            <ErrorMessage
              message={
                isServerError
                  ? 'Server error. Please try again later or contact support if the problem persists.'
                  : error.message || 'Failed to load your purchases'
              }
              className="mb-4"
            />
            {isServerError && (
              <div className="mt-4 text-sm text-gray-300">
                <p className="font-medium mb-2">If this problem continues, please:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Refresh the page</li>
                  <li>Check your internet connection</li>
                  <li>Contact support if the issue persists</li>
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400 mb-4">
                    Error code: 500 - Internal Server Error. This is a backend issue that our team is working to resolve.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
                    {isLoading ? 'Retrying...' : 'Try Again'}
                  </Button>
                </div>
              </div>
            )}
            {!isServerError && error && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
                  {isLoading ? 'Retrying...' : 'Try Again'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Show warning if orders endpoint failed but we have enrollments data */}
            {showOrdersWarning && (
              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-300">
                  <strong>Note:</strong> Some purchase history may not be displayed due to a server issue. Showing available purchases from your enrollments.
                </p>
              </div>
            )}
              {orders.length === 0 ? (
                <div className="bg-[#1A1D29] rounded-xl shadow-sm border border-gray-800 p-12 text-center">
                  <FiShoppingBag className="mx-auto text-gray-500 mb-4" size={48} />
                  <h2 className="text-xl font-semibold text-white mb-2">No purchases yet</h2>
                  <p className="text-gray-400">You haven't made any purchases yet.</p>
                </div>
              ) : (
                <div className="bg-[#1A1D29] rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800 border-b border-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Purchase Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#1A1D29] divide-y divide-gray-800">
                        {orders.map((order) => {
                          const isApproved = order.status === 'approved' || order.status === 'completed';
                          const courseId = order.course?.id || order.courseId;
                          // Use enriched/fetched course so every purchase shows name (including previous orders)
                          const displayCourse = order.course?.title
                            ? order.course
                            : fetchedCoursesById.get(courseId) || order.course;

                          return (
                            <tr key={order.id} className="hover:bg-gray-800/50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {(displayCourse?.thumbnailUrl || order.course?.thumbnailUrl) && (
                                    <img
                                      src={displayCourse?.thumbnailUrl || order.course?.thumbnailUrl}
                                      alt={displayCourse?.title || order.course?.title || 'Course'}
                                      className="w-16 h-16 rounded-lg object-cover border border-gray-700"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-white mb-1">
                                      {displayCourse?.title || order.course?.title || order.courseId || 'N/A'}
                                    </div>
                                    {(displayCourse?.subtitle || order.course?.subtitle) && (
                                      <div className="text-xs text-gray-400 line-clamp-2">
                                        {displayCourse?.subtitle || order.course?.subtitle}
                                      </div>
                                    )}
                                    {courseId && !displayCourse?.title && !order.course?.title && (
                                      <div className="text-xs text-gray-500">
                                        Course ID: {courseId}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">
                                  {formatDate(order.createdAt)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">
                                  {formatCurrency(order.amount, order.currency)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col gap-1">
                                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                                    isApproved
                                      ? 'bg-green-900/30 text-green-400 border border-green-800'
                                      : order.status === 'pending'
                                      ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                                      : order.status === 'rejected' || order.status === 'cancelled'
                                      ? 'bg-red-900/30 text-red-400 border border-red-800'
                                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                                  }`}>
                                    {order.status === 'pending' 
                                      ? '⏳ Pending Verification' 
                                      : isApproved
                                      ? '✅ Verified'
                                      : order.status === 'rejected'
                                      ? '❌ Rejected'
                                      : order.status === 'cancelled'
                                      ? '🚫 Cancelled'
                                      : order.status || 'N/A'}
                                  </span>
                                  {order.status === 'pending' && (
                                    <span className="text-xs text-gray-400 mt-0.5">
                                      Waiting for admin verification
                                    </span>
                                  )}
                                  {isApproved && (
                                    <span className="text-xs text-green-400 mt-0.5">
                                      ✓ Course is available in "My Courses"
                                    </span>
                                  )}
                                  {(order.status === 'rejected' || order.status === 'cancelled') && (
                                    <span className="text-xs text-red-400 mt-0.5">
                                      Contact support for assistance
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {isApproved && courseId ? (
                                  <Link
                                    to={ROUTES.USER.COURSE_LEARNING(courseId)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                                  >
                                    <FiExternalLink size={14} />
                                    View Course
                                  </Link>
                                ) : order.status === 'pending' ? (
                                  <span className="text-xs text-gray-500 italic">
                                    Pending approval
                                  </span>
                                ) : null}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </UserLayout>
  );
};

export const UserPurchasesPage = () => {
  return (
    <ProtectedRoute>
      <UserPurchasesContent />
    </ProtectedRoute>
  );
};

export default UserPurchasesPage;
