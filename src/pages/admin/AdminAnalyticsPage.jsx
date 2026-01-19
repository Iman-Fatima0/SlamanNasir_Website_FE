/**
 * Admin Analytics Page - Revenue, Courses, Students, Funnels
 */

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FiTrendingUp, FiDollarSign, FiBook, FiUsers } from 'react-icons/fi';
import { RevenueAnalytics } from '@/components/admin/analytics/RevenueAnalytics';
import { CourseAnalytics } from '@/components/admin/analytics/CourseAnalytics';
import { StudentAnalytics } from '@/components/admin/analytics/StudentAnalytics';
import { FunnelAnalytics } from '@/components/admin/analytics/FunnelAnalytics';

const AdminAnalyticsContent = () => {
  const [activeTab, setActiveTab] = useState('revenue');

  const tabs = [
    { id: 'revenue', label: 'Revenue', icon: FiDollarSign },
    { id: 'courses', label: 'Courses', icon: FiBook },
    { id: 'students', label: 'Students', icon: FiUsers },
    { id: 'funnels', label: 'Funnels', icon: FiTrendingUp },
  ];

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
          <p className="text-gray-400 text-sm">Detailed analytics and insights</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 font-semibold'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-8">
          {activeTab === 'revenue' && <RevenueAnalytics />}
          {activeTab === 'courses' && <CourseAnalytics />}
          {activeTab === 'students' && <StudentAnalytics />}
          {activeTab === 'funnels' && <FunnelAnalytics />}
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminAnalyticsPage = () => {
  return <AdminAnalyticsContent />;
};

export default AdminAnalyticsPage;

