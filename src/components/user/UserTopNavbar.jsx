/**
 * User Top Navbar Component
 * Fixed top navbar with page title, search, notifications, and profile dropdown
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiBell, FiChevronDown, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';

const getPageTitle = (pathname) => {
  if (pathname === ROUTES.USER.PROFILE) return 'My Profile';
  if (pathname === ROUTES.USER.COURSES) return 'My Courses';
  if (pathname === ROUTES.USER.PURCHASES) return 'My Purchases';
  if (pathname === ROUTES.USER.SETTINGS) return 'Settings';
  return 'Dashboard';
};

export const UserTopNavbar = () => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="user-dashboard fixed top-0 left-0 right-0 h-16 md:h-20 bg-white border-b border-stroke z-50">
      <div className="flex items-center justify-between h-full px-4 md:px-6 lg:px-8">
        {/* Page Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-font-primary">{getPageTitle(location.pathname)}</h1>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-stroke rounded-lg text-font-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-stroke z-50">
                <div className="p-4 border-b border-stroke">
                  <h3 className="font-semibold text-font-primary">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 text-sm text-gray-600">No new notifications</div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-font-primary">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-600">{user?.email}</div>
              </div>
              <FiChevronDown size={16} className="text-gray-600" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-stroke z-50">
                <div className="p-2">
                  <Link
                    to={ROUTES.USER.PROFILE}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-font-primary"
                  >
                    <FiUser size={18} />
                    <span className="text-sm">My Profile</span>
                  </Link>
                  <Link
                    to={ROUTES.USER.SETTINGS}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-font-primary"
                  >
                    <FiSettings size={18} />
                    <span className="text-sm">Settings</span>
                  </Link>
                  <Link
                    to={ROUTES.HOME}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-font-primary"
                  >
                    <span className="text-sm">Back to Site</span>
                  </Link>
                  <div className="border-t border-stroke my-1"></div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  >
                    <FiLogOut size={18} />
                    <span className="text-sm">Logout</span>
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

export default UserTopNavbar;
