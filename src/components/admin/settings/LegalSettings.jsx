/**
 * Legal Settings Component
 * Terms of Service, Privacy Policy, Cookie Policy, etc.
 */

import { useState } from 'react';
import { FiSave, FiFileText } from 'react-icons/fi';

export const LegalSettingsContent = () => {
  const loadInitialState = () => {
    if (typeof window === 'undefined') {
      return {
        termsOfService: '',
        privacyPolicy: '',
        cookiePolicy: '',
        refundPolicy: '',
        userAgreement: '',
        companyName: '',
        businessRegistration: '',
        taxId: '',
        legalAddress: '',
        gdprEnabled: false,
        cookieConsentRequired: true,
        dataRetentionDays: 365,
      };
    }

    try {
      const stored = window.localStorage.getItem('legalSettings');
      if (!stored) {
        return {
          termsOfService: '',
          privacyPolicy: '',
          cookiePolicy: '',
          refundPolicy: '',
          userAgreement: '',
          companyName: '',
          businessRegistration: '',
          taxId: '',
          legalAddress: '',
          gdprEnabled: false,
          cookieConsentRequired: true,
          dataRetentionDays: 365,
        };
      }
      const parsed = JSON.parse(stored);
      return {
        termsOfService: parsed.termsOfService || '',
        privacyPolicy: parsed.privacyPolicy || '',
        cookiePolicy: parsed.cookiePolicy || '',
        refundPolicy: parsed.refundPolicy || '',
        userAgreement: parsed.userAgreement || '',
        companyName: parsed.companyName || '',
        businessRegistration: parsed.businessRegistration || '',
        taxId: parsed.taxId || '',
        legalAddress: parsed.legalAddress || '',
        gdprEnabled: !!parsed.gdprEnabled,
        cookieConsentRequired: parsed.cookieConsentRequired !== false,
        dataRetentionDays: parsed.dataRetentionDays || 365,
      };
    } catch {
      return {
        termsOfService: '',
        privacyPolicy: '',
        cookiePolicy: '',
        refundPolicy: '',
        userAgreement: '',
        companyName: '',
        businessRegistration: '',
        taxId: '',
        legalAddress: '',
        gdprEnabled: false,
        cookieConsentRequired: true,
        dataRetentionDays: 365,
      };
    }
  };

  const [formData, setFormData] = useState(loadInitialState);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('legalSettings', JSON.stringify(formData));
      }
      // eslint-disable-next-line no-alert
      alert('Legal settings saved and will appear on the public legal pages.');
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Failed to save legal settings locally.');
      console.error('Error saving legal settings to localStorage', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Legal Documents */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Legal Documents</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Terms of Service</label>
            <textarea
              value={formData.termsOfService}
              onChange={(e) => handleChange('termsOfService', e.target.value)}
              rows={8}
              placeholder="Enter Terms of Service content..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Rich text editor would be ideal here</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Privacy Policy</label>
            <textarea
              value={formData.privacyPolicy}
              onChange={(e) => handleChange('privacyPolicy', e.target.value)}
              rows={8}
              placeholder="Enter Privacy Policy content..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Cookie Policy</label>
            <textarea
              value={formData.cookiePolicy}
              onChange={(e) => handleChange('cookiePolicy', e.target.value)}
              rows={6}
              placeholder="Enter Cookie Policy content..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Refund Policy</label>
            <textarea
              value={formData.refundPolicy}
              onChange={(e) => handleChange('refundPolicy', e.target.value)}
              rows={6}
              placeholder="Enter Refund Policy content..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Legal Information */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Legal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Business Registration Number</label>
            <input
              type="text"
              value={formData.businessRegistration}
              onChange={(e) => handleChange('businessRegistration', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Tax ID</label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => handleChange('taxId', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Legal Address</label>
            <input
              type="text"
              value={formData.legalAddress}
              onChange={(e) => handleChange('legalAddress', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* GDPR & Compliance */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">GDPR & Compliance</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.gdprEnabled}
              onChange={(e) => handleChange('gdprEnabled', e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
            />
            <span className="text-gray-300">Enable GDPR Compliance</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.cookieConsentRequired}
              onChange={(e) => handleChange('cookieConsentRequired', e.target.checked)}
              className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
            />
            <span className="text-gray-300">Require Cookie Consent</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Data Retention Period (days)</label>
            <input
              type="number"
              min="30"
              value={formData.dataRetentionDays}
              onChange={(e) => handleChange('dataRetentionDays', parseInt(e.target.value) || 365)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">How long to retain user data after account deletion</p>
          </div>
        </div>
      </div>

      {/* Legal Documents Preview */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <FiFileText className="text-blue-400" size={20} />
          <h4 className="text-white font-medium">Document Preview</h4>
        </div>
        <p className="text-sm text-gray-400 mb-3">Preview how legal documents appear to users</p>
        <button
          type="button"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Preview Documents
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

