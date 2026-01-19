/**
 * Revenue Analytics Component
 * Multiple revenue charts and metrics
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

export const RevenueAnalytics = () => {
  const [timeRange, setTimeRange] = useState('monthly');

  // Fetch revenue analytics from backend
  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsRevenue', timeRange],
    queryFn: () => AdminService.getRevenueAnalytics({ period: timeRange }),
  });

  // Format time series data for charts
  const formatTimeSeriesData = (timeSeries) => {
    if (!timeSeries || !Array.isArray(timeSeries)) return [];

    return timeSeries.map((item) => {
      // Format date based on period
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
        // For daily, show day number
        const dayMatch = item.date.match(/\d+/);
        dateLabel = dayMatch ? `Day ${dayMatch[0]}` : item.date;
      } else if (timeRange === 'weekly' && item.date) {
        // For weekly, show week number
        const weekMatch = item.date.match(/\d+/);
        dateLabel = weekMatch ? `Week ${weekMatch[0]}` : item.date;
      }

      return {
        date: dateLabel,
        revenue: item.revenue || 0,
        orders: item.orders || 0,
      };
    });
  };

  const revenueData = formatTimeSeriesData(data?.timeSeries || []);
  const summary = data?.summary || {};
  const totalRevenue = summary.totalRevenue || 0;
  const totalOrders = summary.totalOrders || 0;
  const averageOrderValue = summary.averageOrderValue || 0;
  const revenueGrowth = summary.revenueGrowth || 0;
  const ordersGrowth = summary.ordersGrowth || 0;
  const aovGrowth = summary.aovGrowth || 0;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message || 'Failed to load revenue analytics'} />;
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Revenue Analytics</h2>
          <p className="text-sm text-gray-400">Track revenue trends and performance</p>
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

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
          <p className={`text-xs mt-1 ${revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% from last period
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-white">{totalOrders}</p>
          <p className={`text-xs mt-1 ${ordersGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {ordersGrowth >= 0 ? '+' : ''}{ordersGrowth.toFixed(1)}% from last period
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Average Order Value</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(averageOrderValue)}</p>
          <p className={`text-xs mt-1 ${aovGrowth >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            {aovGrowth >= 0 ? '+' : ''}{aovGrowth.toFixed(1)}% from last period
          </p>
        </div>
      </div>

      {/* Revenue Over Time Chart */}
      <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value) => [formatCurrency(value), 'Revenue']}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue vs Orders Comparison */}
      <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue vs Orders</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis yAxisId="left" stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue ($)" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="orders" fill="#954535" name="Orders" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

