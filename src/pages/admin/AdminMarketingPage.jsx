/**
 * Admin Marketing Page - Coupons, Email Broadcast
 */

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/DataTable';
import { FiPlus, FiEdit, FiTrash2, FiMail } from 'react-icons/fi';

const AdminMarketingContent = () => {
  const [activeTab, setActiveTab] = useState('coupons');
  const [showCouponForm, setShowCouponForm] = useState(false);

  // Mock data - replace with API calls
  const coupons = [];
  const emailCampaigns = [];

  const couponColumns = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'discount', label: 'Discount', sortable: true },
    { key: 'usage', label: 'Usage', sortable: true },
    { key: 'expiry', label: 'Expiry', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-2 text-primary hover:bg-primary/10 rounded-lg">
            <FiEdit size={16} />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-font-primary mb-2">Marketing</h1>
            <p className="text-gray-600">Manage coupons and email campaigns</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-stroke mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'coupons'
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-gray-600 hover:text-primary'
              }`}
            >
              Coupons
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'emails'
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-gray-600 hover:text-primary'
              }`}
            >
              Email Broadcast
            </button>
          </div>
        </div>

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-font-primary">Coupons</h2>
              <button
                onClick={() => setShowCouponForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <FiPlus size={18} />
                <span>New Coupon</span>
              </button>
            </div>
            <DataTable
              columns={couponColumns}
              data={coupons}
              emptyMessage="No coupons created yet"
            />
          </div>
        )}

        {/* Email Broadcast Tab */}
        {activeTab === 'emails' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-font-primary">Email Campaigns</h2>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <FiMail size={18} />
                <span>New Campaign</span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-stroke p-8">
              <div className="text-center text-gray-400">
                Email broadcast functionality - Coming soon
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export const AdminMarketingPage = () => {
  return <AdminMarketingContent />;
};

export default AdminMarketingPage;

