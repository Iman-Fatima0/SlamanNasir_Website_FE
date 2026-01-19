/**
 * Funnel Analytics Component
 * Conversion funnel and user journey analytics
 */

import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

export const FunnelAnalytics = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsFunnels'],
    queryFn: () => AdminService.getFunnelAnalytics(),
  });

  // Get funnel data from backend
  const funnelData = data?.funnel || [];
  const conversionRates = data?.conversionRates || [];
  const funnelByCategory = data?.funnelByCategory || [];
  const timeToConversion = data?.timeToConversion || [];
  
  const summary = data?.summary || {};
  const overallConversionRate = summary.overallConversionRate || 0;
  const cartAbandonmentRate = summary.cartAbandonmentRate || 0;
  const averageTimeToPurchase = summary.averageTimeToPurchase || 0;
  const conversionRateGrowth = summary.conversionRateGrowth || 0;
  const abandonmentRateChange = summary.abandonmentRateChange || 0;
  const timeToPurchaseChange = summary.timeToPurchaseChange || 0;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message || 'Failed to load funnel analytics'} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Funnel Analytics</h2>
        <p className="text-sm text-gray-400">Track conversion rates and user journey</p>
      </div>

      {/* Funnel Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Overall Conversion Rate</p>
          <p className="text-2xl font-bold text-white">{overallConversionRate.toFixed(1)}%</p>
          <p className={`text-xs mt-1 ${conversionRateGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {conversionRateGrowth >= 0 ? '+' : ''}{conversionRateGrowth.toFixed(1)}% from last period
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Cart Abandonment</p>
          <p className="text-2xl font-bold text-white">{cartAbandonmentRate.toFixed(1)}%</p>
          <p className={`text-xs mt-1 ${abandonmentRateChange <= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {abandonmentRateChange >= 0 ? '+' : ''}{abandonmentRateChange.toFixed(1)}% from last period
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Average Time to Purchase</p>
          <p className="text-2xl font-bold text-white">{averageTimeToPurchase.toFixed(1)} days</p>
          <p className={`text-xs mt-1 ${timeToPurchaseChange <= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {timeToPurchaseChange >= 0 ? '+' : ''}{timeToPurchaseChange.toFixed(1)} days from last period
          </p>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="stage" type="category" width={120} stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value, name, props) => [
                  `${value.toLocaleString()} (${props?.payload?.percentage || 0}%)`,
                  name,
                ]}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar dataKey="count" fill="#3B82F6" name="Users" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Rates */}
      <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Conversion Rates by Stage</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conversionRates}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="from" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value) => [`${value}%`, 'Conversion Rate']}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar dataKey="rate" fill="#10B981" name="Conversion Rate (%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Funnel by Category */}
      <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Funnel by Course Category</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={funnelByCategory}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="category" stroke="#9CA3AF" />
              <YAxis yAxisId="left" stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="visitors"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorVisitors)"
                name="Visitors"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="enrollments"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorEnrollments)"
                name="Enrollments"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time to Conversion */}
      <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Time to Conversion</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeToConversion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="period" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Line
                type="monotone"
                dataKey="conversions"
                stroke="#F59E0B"
                strokeWidth={3}
                name="Conversions"
                dot={{ fill: '#F59E0B', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

