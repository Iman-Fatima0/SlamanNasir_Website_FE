/**
 * User Sidebar Component
 * Collapsible sidebar with navigation sections - Matching admin dashboard style
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import forwardArrow from '@/assets/images/forwardarrow.png';
import {
  FiUser,
  FiBook,
  FiShoppingBag,
  FiSettings,
  FiHome,
  FiLogOut,
  FiMoreVertical,
  FiMail,
} from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

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
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showSocialMenu, setShowSocialMenu] = useState(false);

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getItemColor = (section) => {
    if (isActive(section.path)) {
      // Use different colors for variety (blue and green like admin dashboard)
      const index = navSections.findIndex(s => s.path === section.path);
      return index % 2 === 0 ? 'bg-blue-500' : 'bg-green-500';
    }
    return null;
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  return (
    <aside className={`${sidebarWidth} bg-[#0A0E1A] border-r border-gray-900 fixed left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] top-16 md:top-20 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto'} z-40 transition-all duration-300`}>
      <div className={`${isCollapsed ? 'p-2' : 'p-4'} flex flex-col h-full relative`}>
        {/* Collapse Button - Top Center/Right */}
        <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'} mb-4 relative z-50`}>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            onMouseEnter={() => setHoveredItem('collapse')}
            onMouseLeave={() => setHoveredItem(null)}
            className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <img 
              src={forwardArrow} 
              alt={isCollapsed ? 'Expand' : 'Collapse'}
              className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'scale-x-[-1]'}`}
            />
          </button>
          {isCollapsed && hoveredItem === 'collapse' && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[100] pointer-events-none">
              <div className="bg-[#1A1D29] text-white px-4 py-2 rounded-r-lg text-sm whitespace-nowrap shadow-xl relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[#1A1D29]"></div>
                Expand Sidebar
              </div>
            </div>
          )}
          {!isCollapsed && hoveredItem === 'collapse' && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[100] pointer-events-none">
              <div className="bg-[#1A1D29] text-white px-4 py-2 rounded-r-lg text-sm whitespace-nowrap shadow-xl relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[#1A1D29]"></div>
                Collapse Sidebar
              </div>
            </div>
          )}
        </div>

        {/* Logo */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-800">
            <span className="text-white text-xl font-bold">My Dashboard</span>
          </div>
        )}
      
        {/* Back to Site - only show if not collapsed */}
        {!isCollapsed && (
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 text-white hover:text-blue-400 mb-6 pb-4 border-b border-gray-800 transition-colors"
            onMouseEnter={() => setHoveredItem('home')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <FiHome size={18} />
            <span className="text-sm font-medium">Back to Site</span>
          </Link>
        )}

        {/* User Info */}
        {!isCollapsed && (
          <div className="mb-6 pb-4 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-400 truncate">{user?.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {navSections.map((section) => {
            const Icon = section.icon;
            const bgColor = getItemColor(section);

            return (
              <div key={section.path} className="relative">
                <Link
                  to={section.path}
                  onMouseEnter={() => setHoveredItem(section.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-lg transition-colors cursor-pointer ${
                    bgColor
                      ? `${bgColor} text-white`
                      : 'text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{section.label}</span>}
                </Link>
                {/* Tooltip for collapsed state */}
                {isCollapsed && hoveredItem === section.label && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[100] pointer-events-none">
                    <div className="bg-[#1A1D29] text-white px-4 py-2 rounded-r-lg text-sm whitespace-nowrap shadow-xl relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[#1A1D29]"></div>
                      {section.label}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Social Media Icons */}
        <div className="mt-auto pt-4 border-t border-gray-800 relative">
          {isCollapsed ? (
            <button
              type="button"
              onMouseEnter={() => setShowSocialMenu(true)}
              onMouseLeave={() => setShowSocialMenu(false)}
              className={`w-full flex items-center justify-center px-2 py-3 rounded-lg transition-colors text-white hover:bg-gray-800/50 ${
                showSocialMenu ? 'bg-blue-500' : ''
              }`}
            >
              <FiMoreVertical size={20} />
            </button>
          ) : (
            <div className="flex items-center justify-around px-2 py-3">
              {/* Gmail Icon */}
              {import.meta.env.VITE_SOCIAL_GMAIL_URL && (
                <a
                  href={import.meta.env.VITE_SOCIAL_GMAIL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-red-600 cursor-pointer transition-colors group"
                  title="Gmail"
                >
                  <FiMail size={14} className="text-white group-hover:text-white" />
                </a>
              )}
              {/* Facebook Icon */}
              {import.meta.env.VITE_SOCIAL_FACEBOOK_URL && (
                <a
                  href={import.meta.env.VITE_SOCIAL_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-colors group"
                  title="Facebook"
                >
                  <FaFacebook size={14} className="text-white group-hover:text-white" />
                </a>
              )}
              {/* Instagram Icon */}
              {import.meta.env.VITE_SOCIAL_INSTAGRAM_URL && (
                <a
                  href={import.meta.env.VITE_SOCIAL_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 cursor-pointer transition-colors group"
                  title="Instagram"
                >
                  <FaInstagram size={14} className="text-white group-hover:text-white" />
                </a>
              )}
              {/* LinkedIn Icon */}
              {import.meta.env.VITE_SOCIAL_LINKEDIN_URL && (
                <a
                  href={import.meta.env.VITE_SOCIAL_LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-700 cursor-pointer transition-colors group"
                  title="LinkedIn"
                >
                  <FaLinkedin size={14} className="text-white group-hover:text-white" />
                </a>
              )}
            </div>
          )}
          {isCollapsed && showSocialMenu && (
            <div className="absolute left-full bottom-0 ml-2 z-[100] pointer-events-auto">
              <div className="bg-[#1A1D29] px-4 py-3 rounded-r-lg shadow-xl flex gap-3 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[#1A1D29]"></div>
                {/* Gmail Icon */}
                {import.meta.env.VITE_SOCIAL_GMAIL_URL && (
                  <a
                    href={import.meta.env.VITE_SOCIAL_GMAIL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center hover:bg-red-600 cursor-pointer transition-colors"
                    title="Gmail"
                  >
                    <FiMail size={14} className="text-white" />
                  </a>
                )}
                {/* Facebook Icon */}
                {import.meta.env.VITE_SOCIAL_FACEBOOK_URL && (
                  <a
                    href={import.meta.env.VITE_SOCIAL_FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-colors"
                    title="Facebook"
                  >
                    <FaFacebook size={14} className="text-white" />
                  </a>
                )}
                {/* Instagram Icon */}
                {import.meta.env.VITE_SOCIAL_INSTAGRAM_URL && (
                  <a
                    href={import.meta.env.VITE_SOCIAL_INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 cursor-pointer transition-colors"
                    title="Instagram"
                  >
                    <FaInstagram size={14} className="text-white" />
                  </a>
                )}
                {/* LinkedIn Icon */}
                {import.meta.env.VITE_SOCIAL_LINKEDIN_URL && (
                  <a
                    href={import.meta.env.VITE_SOCIAL_LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center hover:bg-blue-700 cursor-pointer transition-colors"
                    title="LinkedIn"
                  >
                    <FaLinkedin size={14} className="text-white" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="pt-4 border-t border-gray-800">
          <button
            onClick={logout}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-lg transition-colors text-red-400 hover:bg-red-900/20 ${
              isCollapsed && hoveredItem === 'logout' ? 'bg-red-900/20' : ''
            }`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <FiLogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
          {/* Tooltip for collapsed logout */}
          {isCollapsed && hoveredItem === 'logout' && (
            <div className="absolute left-full bottom-4 ml-2 z-[100] pointer-events-none">
              <div className="bg-[#1A1D29] text-white px-4 py-2 rounded-r-lg text-sm whitespace-nowrap shadow-xl relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[#1A1D29]"></div>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
