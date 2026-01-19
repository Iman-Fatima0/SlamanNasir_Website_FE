/**
 * Revenue Chart Component using Recharts
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const RevenueChart = ({ data = [] }) => {
  // Use data from backend directly - no mock data fallback
  const chartData = Array.isArray(data) && data.length > 0 ? data : [];
  
  // Show empty state if no data
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400">
        <p>No revenue data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
          formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
          labelStyle={{ color: '#F3F4F6' }}
        />
        <Legend wrapperStyle={{ color: '#9CA3AF' }} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#3B82F6"
          strokeWidth={3}
          name="Revenue"
          dot={{ fill: '#3B82F6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;

