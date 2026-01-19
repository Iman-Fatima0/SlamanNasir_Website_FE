/**
 * Admin Settings Page - General, Payments, Emails, Storage, Security, Legal
 */

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FiSettings, FiCreditCard, FiMail, FiDatabase, FiShield, FiFileText } from 'react-icons/fi';
import { GeneralSettingsContent } from '@/components/admin/settings/GeneralSettings';
import { PaymentsSettingsContent } from '@/components/admin/settings/PaymentsSettings';
import { EmailsSettingsContent } from '@/components/admin/settings/EmailsSettings';
import { StorageSettingsContent } from '@/components/admin/settings/StorageSettings';
import { SecuritySettingsContent } from '@/components/admin/settings/SecuritySettings';
import { LegalSettingsContent } from '@/components/admin/settings/LegalSettings';

const AdminSettingsContent = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'payments', label: 'Payments', icon: FiCreditCard },
    { id: 'emails', label: 'Emails', icon: FiMail },
    { id: 'storage', label: 'Storage', icon: FiDatabase },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'legal', label: 'Legal', icon: FiFileText },
  ];

  return (
    <AdminLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
          <p className="text-gray-400 text-sm">Manage platform settings and configurations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-[#1A1D29] rounded-2xl shadow-lg border border-gray-800 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {tabs.find((t) => t.id === activeTab)?.label} Settings
                </h2>
                <p className="text-gray-400">
                  Configure {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} settings
                </p>
              </div>

              {/* Render different content based on active tab */}
              {activeTab === 'general' && <GeneralSettingsContent />}
              {activeTab === 'payments' && <PaymentsSettingsContent />}
              {activeTab === 'emails' && <EmailsSettingsContent />}
              {activeTab === 'storage' && <StorageSettingsContent />}
              {activeTab === 'security' && <SecuritySettingsContent />}
              {activeTab === 'legal' && <LegalSettingsContent />}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminSettingsPage = () => {
  return <AdminSettingsContent />;
};

export default AdminSettingsPage;

