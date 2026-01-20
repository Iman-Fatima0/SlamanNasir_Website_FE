/**
 * Security Settings Component
 * Authentication, security policies, API security
 */

import { useState } from 'react';
import { FiSave, FiShield } from 'react-icons/fi';

export const SecuritySettingsContent = () => {
  const [formData, setFormData] = useState({
    minPasswordLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    sessionTimeout: 60,
    twoFactorEnabled: false,
    accountLockoutAttempts: 5,
    accountLockoutDuration: 30,
    rateLimitEnabled: true,
    rateLimitRequests: 100,
    rateLimitWindow: 15,
    corsOrigins: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving security settings:', formData);
    alert('Security settings saved! (This is a placeholder - connect to backend API)');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Password Requirements */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Password Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Minimum Password Length</label>
            <input
              type="number"
              min="6"
              max="32"
              value={formData.minPasswordLength}
              onChange={(e) => handleChange('minPasswordLength', parseInt(e.target.value) || 8)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              min="5"
              value={formData.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value) || 60)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.requireUppercase}
              onChange={(e) => handleChange('requireUppercase', e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
            />
            <span className="text-gray-300">Require Uppercase Letters</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.requireLowercase}
              onChange={(e) => handleChange('requireLowercase', e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
            />
            <span className="text-gray-300">Require Lowercase Letters</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.requireNumbers}
              onChange={(e) => handleChange('requireNumbers', e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
            />
            <span className="text-gray-300">Require Numbers</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.requireSpecialChars}
              onChange={(e) => handleChange('requireSpecialChars', e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
            />
            <span className="text-gray-300">Require Special Characters</span>
          </label>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.twoFactorEnabled}
            onChange={(e) => handleChange('twoFactorEnabled', e.target.checked)}
            className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
          />
          <span className="text-gray-300">Require 2FA for Admin Accounts</span>
        </label>
      </div>

      {/* Account Lockout */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Account Lockout</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Lockout After Failed Attempts</label>
            <input
              type="number"
              min="3"
              max="10"
              value={formData.accountLockoutAttempts}
              onChange={(e) => handleChange('accountLockoutAttempts', parseInt(e.target.value) || 5)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Lockout Duration (minutes)</label>
            <input
              type="number"
              min="5"
              value={formData.accountLockoutDuration}
              onChange={(e) => handleChange('accountLockoutDuration', parseInt(e.target.value) || 30)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Rate Limiting */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Rate Limiting</h3>
        <div className="space-y-3 mb-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.rateLimitEnabled}
              onChange={(e) => handleChange('rateLimitEnabled', e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
            />
            <span className="text-gray-300">Enable Rate Limiting</span>
          </label>
        </div>
        {formData.rateLimitEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Max Requests</label>
              <input
                type="number"
                min="10"
                value={formData.rateLimitRequests}
                onChange={(e) => handleChange('rateLimitRequests', parseInt(e.target.value) || 100)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Time Window (minutes)</label>
              <input
                type="number"
                min="1"
                value={formData.rateLimitWindow}
                onChange={(e) => handleChange('rateLimitWindow', parseInt(e.target.value) || 15)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* CORS Settings */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">CORS Settings</h3>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Allowed Origins</label>
          <textarea
            value={formData.corsOrigins}
            onChange={(e) => handleChange('corsOrigins', e.target.value)}
            rows={3}
            placeholder="https://example.com&#10;https://www.example.com"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">One origin per line</p>
        </div>
      </div>

      {/* Security Logs */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <FiShield className="text-blue-400" size={20} />
          <h4 className="text-white font-medium">Security Logs</h4>
        </div>
        <p className="text-sm text-gray-400 mb-3">View recent security events and login attempts</p>
        <button
          type="button"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          View Security Logs
        </button>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-800">
        <button
          type="submit"
          className="bg-primary rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
            transition-all duration-200 ease-in-out border-2 border-primary/80
            shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
            hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
            focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] flex items-center gap-2"
        >
          <FiSave size={18} />
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
};

