/**
 * Admin Sidebar Component
 * Collapsible sidebar with navigation sections - Thor-style design
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useSidebar } from '@/context/SidebarContext';
import forwardArrow from '@/assets/images/forwardarrow.png';
import {
  FiBarChart2,
  FiBook,
  FiUsers,
  FiShoppingCart,
  FiTrendingUp,
  FiMail,
  FiHelpCircle,
  FiSettings,
  FiChevronRight,
  FiChevronDown,
  FiHome,
  FiMoreVertical,
} from 'react-icons/fi';

const navSections = [
  {
    label: 'Dashboard',
    path: ROUTES.ADMIN.DASHBOARD,
    icon: FiBarChart2,
  },
  {
    label: 'Courses',
    icon: FiBook,
    children: [
      { label: 'All Courses', path: ROUTES.ADMIN.COURSES },
      // Add more course sub-items as needed
    ],
  },
  {
    label: 'Users',
    icon: FiUsers,
    children: [
      { label: 'All Users', path: ROUTES.ADMIN.USERS },
      { label: 'Instructors', path: ROUTES.ADMIN.INSTRUCTORS },
    ],
  },
  {
    label: 'Sales',
    icon: FiShoppingCart,
    children: [
      { label: 'Orders', path: ROUTES.ADMIN.ORDERS },
      // Add more sales sub-items as needed
    ],
  },
  {
    label: 'Analytics',
    path: ROUTES.ADMIN.ANALYTICS,
    icon: FiTrendingUp,
  },
  {
    label: 'Marketing',
    path: ROUTES.ADMIN.MARKETING,
    icon: FiMail,
  },
  {
    label: 'Support',
    icon: FiHelpCircle,
    children: [
      // Add support sub-items as needed
    ],
  },
  {
    label: 'Settings',
    path: ROUTES.ADMIN.SETTINGS,
    icon: FiSettings,
  },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [expandedSections, setExpandedSections] = useState({
    Courses: true,
    Users: true,
    Sales: true,
  });
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showSocialMenu, setShowSocialMenu] = useState(false);

  const toggleSection = (label) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSectionActive = (section) => {
    if (section.path) {
      return isActive(section.path);
    }
    if (section.children) {
      return section.children.some((child) => isActive(child.path));
    }
    return false;
  };

  const getItemColor = (section, isChild = false) => {
    const active = isChild ? isActive(section.path) : isSectionActive(section);
    if (active) {
      // Use different colors for variety (blue and green like in the image)
      const index = navSections.findIndex(s => s.label === section.label || s.children?.some(c => c.path === section.path));
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
              <span className="text-white text-xl font-bold">Salman Nasir</span>
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

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {navSections.map((section) => {
              const Icon = section.icon;
              const hasChildren = section.children && section.children.length > 0;
              const isExpanded = expandedSections[section.label];
              const bgColor = getItemColor(section);

              if (hasChildren) {
                // When collapsed, navigate to first child on click
                const firstChildPath = section.children && section.children.length > 0 ? section.children[0].path : '#';
                
                const handleClick = (e) => {
                  if (isCollapsed) {
                    // When collapsed, let Link handle navigation
                    return;
                  }
                  // When expanded, toggle section
                  e.preventDefault();
                  toggleSection(section.label);
                };

                return (
                  <div key={section.label} className="relative">
                    {isCollapsed ? (
                      <Link
                        to={firstChildPath}
                        onMouseEnter={() => setHoveredItem(section.label)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`w-full flex items-center justify-center px-2 py-3 rounded-lg transition-colors relative cursor-pointer ${
                          bgColor
                            ? `${bgColor} text-white`
                            : 'text-white hover:bg-gray-800/50'
                        }`}
                      >
                        <Icon size={20} className="flex-shrink-0" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={handleClick}
                        onMouseEnter={() => setHoveredItem(section.label)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors relative cursor-pointer ${
                          bgColor
                            ? `${bgColor} text-white`
                            : 'text-white hover:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} className="flex-shrink-0" />
                          <span className="font-medium">{section.label}</span>
                        </div>
                        {isExpanded ? (
                          <FiChevronDown size={16} />
                        ) : (
                          <FiChevronRight size={16} />
                        )}
                      </button>
                    )}
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && hoveredItem === section.label && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[100] pointer-events-none">
                        <div className="bg-[#1A1D29] text-white px-4 py-2 rounded-r-lg text-sm whitespace-nowrap shadow-xl relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[#1A1D29]"></div>
                          {section.label}
                        </div>
                      </div>
                    )}
                    {!isCollapsed && isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {section.children.map((child) => {
                          const childBgColor = getItemColor(child, true);
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                childBgColor
                                  ? `${childBgColor} text-white`
                                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                              }`}
                            >
                              <span className="text-sm">{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={section.label} className="relative">
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
                  {/* Social icons would go here - placeholder for now */}
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors" title="Telegram" />
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors" title="Twitter" />
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors" title="Discord" />
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 cursor-pointer transition-colors" title="Reddit" />
                </div>
              )}
              {isCollapsed && showSocialMenu && (
                <div className="absolute left-full bottom-0 ml-2 z-[100] pointer-events-auto">
                  <div className="bg-[#1A1D29] px-4 py-3 rounded-r-lg shadow-xl flex gap-3 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-[#1A1D29]"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center hover:bg-gray-500 cursor-pointer transition-colors" title="Telegram" />
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center hover:bg-gray-500 cursor-pointer transition-colors" title="Twitter" />
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center hover:bg-gray-500 cursor-pointer transition-colors" title="Discord" />
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center hover:bg-gray-500 cursor-pointer transition-colors" title="Reddit" />
                  </div>
                </div>
              )}
            </div>
        </div>
      </aside>
  );
};

export default AdminSidebar;

