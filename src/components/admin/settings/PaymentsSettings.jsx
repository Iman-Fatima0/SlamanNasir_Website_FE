/**
 * Payments Settings Component
 * Payment gateways, currency, tax, payout settings
 */

import { useState } from 'react';
import { FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

export const PaymentsSettingsContent = () => {
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  const [formData, setFormData] = useState({
    stripePublishableKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    paypalSecret: '',
    defaultCurrency: 'USD',
    taxRate: 0,
    taxEnabled: false,
    instructorPayoutPercentage: 70,
    payoutSchedule: 'monthly',
    minimumPayout: 50,
    refundWindow: 30,
    autoRefund: false,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving payment settings:', formData);
    alert('Payment settings saved! (This is a placeholder - connect to backend API)');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Gateways */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Payment Gateways</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Stripe Publishable Key</label>
            <input
              type="text"
              value={formData.stripePublishableKey}
              onChange={(e) => handleChange('stripePublishableKey', e.target.value)}
              placeholder="pk_test_..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Stripe Secret Key</label>
            <div className="relative">
              <input
                type={showStripeSecret ? 'text' : 'password'}
                value={formData.stripeSecretKey}
                onChange={(e) => handleChange('stripeSecretKey', e.target.value)}
                placeholder="sk_test_..."
                className="w-full px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowStripeSecret(!showStripeSecret)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showStripeSecret ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">PayPal Client ID</label>
            <input
              type="text"
              value={formData.paypalClientId}
              onChange={(e) => handleChange('paypalClientId', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Currency & Tax */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Currency & Tax</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Default Currency</label>
            <select
              value={formData.defaultCurrency}
              onChange={(e) => handleChange('defaultCurrency', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="SAR">SAR (﷼)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tax Rate (%)</label>
            <input
              type="number"
              step="0.01"
              value={formData.taxRate}
              onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.taxEnabled}
                onChange={(e) => handleChange('taxEnabled', e.target.checked)}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">Enable Tax Collection</span>
            </label>
          </div>
        </div>
      </div>

      {/* Payout Settings */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Instructor Payouts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Instructor Payout Percentage</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.instructorPayoutPercentage}
              onChange={(e) => handleChange('instructorPayoutPercentage', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Percentage of course revenue paid to instructors</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Payout Schedule</label>
            <select
              value={formData.payoutSchedule}
              onChange={(e) => handleChange('payoutSchedule', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Minimum Payout ($)</label>
            <input
              type="number"
              min="0"
              value={formData.minimumPayout}
              onChange={(e) => handleChange('minimumPayout', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Refund Policy */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Refund Policy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Refund Window (days)</label>
            <input
              type="number"
              min="0"
              value={formData.refundWindow}
              onChange={(e) => handleChange('refundWindow', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.autoRefund}
                onChange={(e) => handleChange('autoRefund', e.target.checked)}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">Enable Automatic Refunds</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-800">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors shadow-lg"
        >
          <FiSave size={18} />
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
};

