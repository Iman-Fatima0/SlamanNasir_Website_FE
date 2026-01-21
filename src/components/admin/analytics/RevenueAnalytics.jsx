/**
 * Revenue Analytics Component
 * Multiple revenue charts and metrics
 */

import { useState, useMemo } from 'react';
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

  // Helper function to get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Helper function to pad numbers
  const padStart = (num, length) => {
    const str = String(num);
    return str.length >= length ? str : '0'.repeat(length - str.length) + str;
  };

  // Fallback: Fetch all orders to calculate analytics if backend returns empty data
  const { data: ordersData } = useQuery({
    queryKey: ['adminOrders', 'all'],
    queryFn: () => AdminService.getOrders({ page: 1, limit: 1000 }),
    enabled: !isLoading && (!data || (data?.summary?.totalRevenue === 0 && data?.summary?.totalOrders === 0)),
  });

  // Calculate analytics from orders if backend data is empty
  const calculatedAnalytics = useMemo(() => {
    const orders = ordersData?.data?.orders || ordersData?.orders || [];
    
    if (orders.length === 0) {
      return null;
    }

    // Filter completed/paid orders for revenue calculation
    const completedOrders = orders.filter(order => 
      order.status === 'completed' || order.status === 'paid'
    );

    // Calculate totals
    // Total Revenue: only from completed/paid orders
    const totalRevenue = completedOrders.reduce((sum, order) => {
      return sum + (Number.parseFloat(order.totalAmount || order.amount || 0));
    }, 0);

    // Total Orders: count all orders (to show activity)
    const totalOrders = orders.length;
    
    // Average Order Value: revenue / completed orders
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    // Group orders by time period for time series
    const timeSeriesMap = new Map();
    
    completedOrders.forEach(order => {
      if (!order.createdAt) return;
      
      const date = new Date(order.createdAt);
      let key = '';
      
      if (timeRange === 'monthly') {
        key = `${date.getFullYear()}-${padStart(date.getMonth() + 1, 2)}`;
      } else if (timeRange === 'weekly') {
        const week = getWeekNumber(date);
        key = `${date.getFullYear()}-W${padStart(week, 2)}`;
      } else if (timeRange === 'daily') {
        key = `${date.getFullYear()}-${padStart(date.getMonth() + 1, 2)}-${padStart(date.getDate(), 2)}`;
      }

      if (key) {
        const existing = timeSeriesMap.get(key) || { revenue: 0, orders: 0 };
        timeSeriesMap.set(key, {
          revenue: existing.revenue + (Number.parseFloat(order.totalAmount || order.amount || 0)),
          orders: existing.orders + 1,
          date: key,
        });
      }
    });

    // Convert to array and sort by date
    const timeSeries = Array.from(timeSeriesMap.values())
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate growth (compare current period with previous)
    const currentPeriodRevenue = timeSeries.slice(-1)[0]?.revenue || 0;
    const previousPeriodRevenue = timeSeries.slice(-2, -1)[0]?.revenue || 0;
    const revenueGrowth = previousPeriodRevenue > 0 
      ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
      : 0;

    const currentPeriodOrders = timeSeries.slice(-1)[0]?.orders || 0;
    const previousPeriodOrders = timeSeries.slice(-2, -1)[0]?.orders || 0;
    const ordersGrowth = previousPeriodOrders > 0 
      ? ((currentPeriodOrders - previousPeriodOrders) / previousPeriodOrders) * 100 
      : 0;

    const currentPeriodAOV = currentPeriodOrders > 0 ? currentPeriodRevenue / currentPeriodOrders : 0;
    const previousPeriodAOV = previousPeriodOrders > 0 ? previousPeriodRevenue / previousPeriodOrders : 0;
    const aovGrowth = previousPeriodAOV > 0 
      ? ((currentPeriodAOV - previousPeriodAOV) / previousPeriodAOV) * 100 
      : 0;

    return {
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        revenueGrowth,
        ordersGrowth,
        aovGrowth,
      },
      timeSeries,
    };
  }, [ordersData, timeRange]);

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
        const weekMatch = item.date.match(/W(\d+)/);
        dateLabel = weekMatch ? `Week ${weekMatch[1]}` : item.date;
      }

      return {
        date: dateLabel,
        revenue: item.revenue || 0,
        orders: item.orders || 0,
      };
    });
  };

  // Use calculated analytics if backend data is empty, otherwise use backend data
  const analyticsData = (data?.summary?.totalRevenue > 0 || data?.summary?.totalOrders > 0) 
    ? data 
    : calculatedAnalytics;

  const revenueData = formatTimeSeriesData(analyticsData?.timeSeries || []);
  const summary = analyticsData?.summary || {};
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

