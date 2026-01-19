/**
 * KPI Card Component with trend indicators
 * Professional grey-themed admin dashboard cards
 */

import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export const KPICard = ({ title, value, trend, trendValue, icon: Icon, onClick }) => {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? FiTrendingUp : FiTrendingDown;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer ${
        onClick ? 'hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon size={20} className="text-gray-600" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex-1">
          <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
          {trend && trendValue && (
            <div className="flex items-center gap-2 text-sm">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isPositive 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-red-50 text-red-600'
              }`}>
                <TrendIcon size={14} />
                <span>{trendValue}</span>
              </div>
              <span className="text-gray-500 text-xs">
                {isPositive ? 'Higher' : 'Lower'} than Last Month
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard;

