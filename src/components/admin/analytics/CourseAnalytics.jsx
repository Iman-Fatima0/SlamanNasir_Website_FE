/**
 * Course Analytics Component
 * Course performance and enrollment analytics
 */

import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#3B82F6', '#954535', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const CourseAnalytics = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsCourses'],
    queryFn: () => AdminService.getCourseAnalytics({ limit: 10, sortBy: 'enrollments' }),
  });

  // Format course data from backend
  const formatCourseData = () => {
    const courses = data?.courses || [];
    
    if (courses.length === 0) {
      return [];
    }

    return courses.map((course) => ({
      course: course.courseTitle || course.title || 'Untitled Course',
      enrollments: course.enrollments || 0,
      revenue: course.revenue || 0,
      completion: course.completionRate || 0,
    }));
  };

  const courseData = formatCourseData();
  const topCourses = [...courseData].sort((a, b) => b.enrollments - a.enrollments).slice(0, 5);

  // Course completion data from backend
  const completionStatus = data?.completionStatus || { completed: 0, inProgress: 0 };
  const completionData = [
    { name: 'Completed', value: completionStatus.completed || 0 },
    { name: 'In Progress', value: completionStatus.inProgress || 0 },
  ];

  // Enrollment trend from backend
  const formatEnrollmentTrend = () => {
    const trend = data?.enrollmentTrend || [];
    
    return trend.map((item) => {
      let monthLabel = item.month;
      if (item.month && item.month.includes('-')) {
        // Format "2024-01" to "Jan"
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dateParts = item.month.split('-');
        if (dateParts.length >= 2) {
          const monthIndex = Number.parseInt(dateParts[1], 10) - 1;
          monthLabel = monthNames[monthIndex] || item.month;
        }
      }
      return {
        month: monthLabel,
        enrollments: item.enrollments || 0,
      };
    });
  };

  const enrollmentTrend = formatEnrollmentTrend();

  const summary = data?.summary || {};
  const totalCourses = summary?.totalCourses ?? courseData?.length ?? 0;
  const totalEnrollments = summary.totalEnrollments || courseData.reduce((sum, c) => sum + c.enrollments, 0);
  const averageCompletionRate = summary.averageCompletionRate || (courseData.length > 0 ? Math.round(courseData.reduce((sum, c) => sum + c.completion, 0) / courseData.length) : 0);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message || 'Failed to load course analytics'} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Course Analytics</h2>
        <p className="text-sm text-gray-400">Track course performance and enrollments</p>
      </div>

      {/* Course Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Total Courses</p>
          <p className="text-2xl font-bold text-white">{totalCourses}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Total Enrollments</p>
          <p className="text-2xl font-bold text-white">{totalEnrollments}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Average Completion Rate</p>
          <p className="text-2xl font-bold text-white">{averageCompletionRate}%</p>
        </div>
      </div>

      {/* Top Courses by Enrollments */}
      <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Courses by Enrollments</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCourses} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="course" type="category" width={150} stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar dataKey="enrollments" fill="#3B82F6" name="Enrollments" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Revenue */}
      <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Course Revenue</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCourses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="course" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar dataKey="revenue" fill="#954535" name="Revenue" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enrollment Trend */}
      <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Enrollment Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Line
                type="monotone"
                dataKey="enrollments"
                stroke="#10B981"
                strokeWidth={3}
                name="Enrollments"
                dot={{ fill: '#10B981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Completion Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Completion Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {completionData.map((entry, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top 5 Courses</h3>
          <div className="space-y-3">
            {topCourses.map((course, idx) => (
              <div key={course.course} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{course.course}</p>
                    <p className="text-sm text-gray-400">{course.enrollments} enrollments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${course.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">{course.completion}% complete</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

