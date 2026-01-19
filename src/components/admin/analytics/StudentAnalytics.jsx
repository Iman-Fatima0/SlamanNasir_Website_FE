/**
 * Student Analytics Component
 * Student growth, engagement, and activity analytics
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const StudentAnalytics = () => {
  const [timeRange, setTimeRange] = useState('monthly');

  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsStudents', timeRange],
    queryFn: () => AdminService.getStudentAnalytics({ period: timeRange }),
  });

  // Format student growth data from backend
  const formatStudentGrowthData = () => {
    const growth = data?.growth || [];
    
    return growth.map((item) => {
      let dateLabel = item.date;
      if (timeRange === 'monthly' && item.date) {
        // Extract month abbreviation from date string (e.g., "2024-01" -> "Jan")
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dateParts = item.date.split('-');
        if (dateParts.length >= 2) {
          const monthIndex = Number.parseInt(dateParts[1], 10) - 1;
          dateLabel = monthNames[monthIndex] || item.date;
        }
      } else if (timeRange === 'daily' && item.date) {
        const dayMatch = item.date.match(/\d+/);
        dateLabel = dayMatch ? `Day ${dayMatch[0]}` : item.date;
      } else if (timeRange === 'weekly' && item.date) {
        const weekMatch = item.date.match(/\d+/);
        dateLabel = weekMatch ? `Week ${weekMatch[0]}` : item.date;
      }

      return {
        date: dateLabel,
        newStudents: item.newStudents || 0,
        activeStudents: item.activeStudents || 0,
      };
    });
  };

  const studentData = formatStudentGrowthData();
  const summary = data?.summary || {};
  const totalStudents = summary.totalStudents || 0;
  const newStudents = summary.newStudents || 0;
  const activeStudents = summary.activeStudents || 0;
  const completionRate = summary.completionRate || 0;
  const newStudentsGrowth = summary.newStudentsGrowth || 0;
  const activeStudentsGrowth = summary.activeStudentsGrowth || 0;
  const completionRateGrowth = summary.completionRateGrowth || 0;

  // Student engagement data from backend
  const engagementData = data?.engagement || [];

  // Student activity by day of week from backend
  const formatActivityByDay = () => {
    const activity = data?.activityByDay || [];
    
    return activity.map((item) => ({
      day: item.day ? item.day.substring(0, 3) : 'Mon', // Shorten to 3 letters
      logins: item.logins || 0,
      completions: item.completions || 0,
    }));
  };

  const activityByDay = formatActivityByDay();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message || 'Failed to load student analytics'} />;
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Student Analytics</h2>
          <p className="text-sm text-gray-400">Track student growth and engagement</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Student Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Total Students</p>
          <p className="text-2xl font-bold text-white">{totalStudents}</p>
          <p className="text-xs text-green-400 mt-1">+12.5% from last period</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">New Students</p>
          <p className="text-2xl font-bold text-white">{newStudents}</p>
          <p className={`text-xs mt-1 ${newStudentsGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {newStudentsGrowth >= 0 ? '+' : ''}{newStudentsGrowth.toFixed(1)}% from last period
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Active Students</p>
          <p className="text-2xl font-bold text-white">{activeStudents}</p>
          <p className={`text-xs mt-1 ${activeStudentsGrowth >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            {activeStudentsGrowth >= 0 ? '+' : ''}{activeStudentsGrowth.toFixed(1)}% from last period
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Completion Rate</p>
          <p className="text-2xl font-bold text-white">{completionRate.toFixed(1)}%</p>
          <p className={`text-xs mt-1 ${completionRateGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {completionRateGrowth >= 0 ? '+' : ''}{completionRateGrowth.toFixed(1)}% from last period
          </p>
        </div>
      </div>

      {/* Student Growth Chart */}
      <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Student Growth</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={studentData}>
              <defs>
                <linearGradient id="colorNewStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorActiveStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Area
                type="monotone"
                dataKey="newStudents"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorNewStudents)"
                name="New Students"
              />
              <Area
                type="monotone"
                dataKey="activeStudents"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorActiveStudents)"
                name="Active Students"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Student Engagement</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="students"
                >
                  {engagementData.map((entry, index) => (
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
          <h3 className="text-lg font-semibold text-white mb-4">Activity by Day</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                <Bar dataKey="logins" fill="#3B82F6" name="Logins" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completions" fill="#10B981" name="Completions" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

