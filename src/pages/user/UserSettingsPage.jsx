/**
 * User Settings Page
 */

import { useState } from 'react';
import { UserLayout } from '@/components/user/UserLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Button } from '@/components/common/Button';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FiSettings, FiBell, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthService } from '@/services';

const UserSettingsContent = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    courseUpdates: true,
  });

  // Change Password Modal State
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPasswordError('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await AuthService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        // Reset form and close modal
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowChangePasswordModal(false);
        alert('Password changed successfully!');
      } else {
        setPasswordError(response.message || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const closePasswordModal = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordError('');
    setShowChangePasswordModal(false);
  };

  return (
    <UserLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Account Settings */}
        <div className="bg-[#1A1D29] rounded-xl shadow-sm border border-gray-800 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FiSettings className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="change-password-btn" className="block text-sm font-medium text-gray-300 mb-2">Change Password</label>
              <Button 
                id="change-password-btn"
                variant="outline" 
                onClick={() => setShowChangePasswordModal(true)}
                className="cursor-pointer"
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-[#1A1D29] rounded-xl shadow-sm border border-gray-800 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FiBell className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Notification Preferences</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="mr-3 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 bg-gray-800 rounded"
              />
              <span className="text-sm text-gray-300">Email notifications</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.courseUpdates}
                onChange={() => handleNotificationChange('courseUpdates')}
                className="mr-3 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 bg-gray-800 rounded"
              />
              <span className="text-sm text-gray-300">Course updates</span>
            </label>
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#1A1D29] rounded-xl shadow-lg border border-gray-800 p-8 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Change Password</h2>
                <button
                  onClick={closePasswordModal}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <FiX size={24} />
                </button>
              </div>

              {passwordError && (
                <div className="mb-4">
                  <ErrorMessage message={passwordError} />
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-300 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="current-password"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      placeholder="Enter current password"
                      required
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.current ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      placeholder="Enter new password"
                      required
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.new ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      placeholder="Confirm new password"
                      required
                      disabled={isChangingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPasswords.confirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isChangingPassword}
                    className="flex-1"
                  >
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closePasswordModal}
                    disabled={isChangingPassword}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export const UserSettingsPage = () => {
  return (
    <ProtectedRoute>
      <UserSettingsContent />
    </ProtectedRoute>
  );
};

export default UserSettingsPage;
