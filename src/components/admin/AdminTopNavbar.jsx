/**
 * Admin Top Navbar Component
 * Fixed top navbar with logo, search, notifications, and profile dropdown
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiBell, FiPlus, FiChevronDown, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';

export const AdminTopNavbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  const quickActions = [
    { label: 'New Course', path: ROUTES.ADMIN.COURSES, icon: FiPlus },
    // Add more quick actions as needed
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-[#1A1D29] border-b border-gray-800 z-50">
      <div className="flex items-center justify-between h-full px-4 md:px-6 lg:px-8">
        {/* Page Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white font-sans">Dashboard</h1>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <action.icon size={18} />
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 text-sm text-gray-400">No new notifications</div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-white">
                  {user?.firstName || 'Admin'} {user?.lastName || ''}
                </div>
                <div className="text-xs text-gray-400">
                  @{user?.email?.split('@')[0] || 'admin'}
                </div>
              </div>
              <FiChevronDown size={16} className="text-gray-400" />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                <div className="p-2">
                  <Link
                    to={ROUTES.ADMIN.SETTINGS}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <FiSettings size={18} className="text-gray-400" />
                    <span className="text-sm text-white">Settings</span>
                  </Link>
                  <Link
                    to={ROUTES.HOME}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <FiUser size={18} className="text-gray-400" />
                    <span className="text-sm text-white">View Site</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-900/20 transition-colors text-left"
                  >
                    <FiLogOut size={18} className="text-red-400" />
                    <span className="text-sm text-red-400">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminTopNavbar;

