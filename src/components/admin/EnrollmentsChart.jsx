/**
 * Enrollments by Course Chart Component using Recharts
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const EnrollmentsChart = ({ data = [] }) => {
  // Use data from backend directly - no mock data fallback
  const chartData = Array.isArray(data) && data.length > 0 ? data : [];
  
  // Show empty state if no data
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400">
        <p>No enrollment data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis type="number" stroke="#9CA3AF" />
        <YAxis dataKey="course" type="category" width={120} stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
          labelStyle={{ color: '#F3F4F6' }}
        />
        <Legend wrapperStyle={{ color: '#9CA3AF' }} />
        <Bar dataKey="enrollments" fill="#954535" name="Enrollments" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EnrollmentsChart;

