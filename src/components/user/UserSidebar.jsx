/**
 * User Sidebar Component
 * Collapsible sidebar with navigation sections
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import {
  FiUser,
  FiBook,
  FiShoppingBag,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiLogOut,
} from 'react-icons/fi';

const navSections = [
  {
    label: 'My Profile',
    path: ROUTES.USER.PROFILE,
    icon: FiUser,
  },
  {
    label: 'My Courses',
    path: ROUTES.USER.COURSES,
    icon: FiBook,
  },
  {
    label: 'My Purchases',
    path: ROUTES.USER.PURCHASES,
    icon: FiShoppingBag,
  },
  {
    label: 'Settings',
    path: ROUTES.USER.SETTINGS,
    icon: FiSettings,
  },
];

export const UserSidebar = () => {
  const location = useLocation();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside
      className={`fixed left-0 top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-white border-r border-stroke z-40 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 w-6 h-6 bg-white border border-stroke rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-50"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
      </button>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-6 border-b border-stroke">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-font-primary truncate">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-sm text-gray-600 truncate">{user?.email}</div>
            </div>
          </div>
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
          >
            <FiHome size={16} />
            <span>Back to Site</span>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {navSections.map((section) => {
            const Icon = section.icon;
            const active = isActive(section.path);

            return (
              <Link
                key={section.path}
                to={section.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={isCollapsed ? section.label : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{section.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-stroke">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <FiLogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
