/**
 * Emails Settings Component
 * SMTP configuration and email templates
 */

import { useState } from 'react';
import { FiSave, FiEye, FiEyeOff, FiMail } from 'react-icons/fi';

export const EmailsSettingsContent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    fromEmail: '',
    fromName: 'Salman Nasir',
    emailNotifications: true,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving email settings:', formData);
    alert('Email settings saved! (This is a placeholder - connect to backend API)');
  };

  const handleTestEmail = () => {
    // TODO: Connect to backend API to send test email
    alert('Test email sent! (This is a placeholder - connect to backend API)');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SMTP Configuration */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">SMTP Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">SMTP Host</label>
            <input
              type="text"
              value={formData.smtpHost}
              onChange={(e) => handleChange('smtpHost', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">SMTP Port</label>
            <input
              type="number"
              value={formData.smtpPort}
              onChange={(e) => handleChange('smtpPort', parseInt(e.target.value) || 587)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">SMTP Username</label>
            <input
              type="text"
              value={formData.smtpUser}
              onChange={(e) => handleChange('smtpUser', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">SMTP Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.smtpPassword}
                onChange={(e) => handleChange('smtpPassword', e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Encryption</label>
            <select
              value={formData.smtpEncryption}
              onChange={(e) => handleChange('smtpEncryption', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </div>

      {/* From Address */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">From Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">From Email</label>
            <input
              type="email"
              value={formData.fromEmail}
              onChange={(e) => handleChange('fromEmail', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">From Name</label>
            <input
              type="text"
              value={formData.fromName}
              onChange={(e) => handleChange('fromName', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Email Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Email Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.emailNotifications}
              onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
            />
            <span className="text-gray-300">Enable Email Notifications</span>
          </label>
        </div>
      </div>

      {/* Test Email */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium mb-1">Test Email Configuration</h4>
            <p className="text-sm text-gray-400">Send a test email to verify SMTP settings</p>
          </div>
          <button
            type="button"
            onClick={handleTestEmail}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiMail size={18} />
            <span>Send Test Email</span>
          </button>
        </div>
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

