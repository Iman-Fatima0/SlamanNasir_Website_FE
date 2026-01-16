/**
 * Admin Layout Component - Provides navigation and layout for admin pages
 */

import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { FiBarChart2, FiUsers, FiBook, FiUserCheck, FiShoppingCart, FiHome } from 'react-icons/fi';

const adminNavLinks = [
  { path: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard', icon: FiBarChart2 },
  { path: ROUTES.ADMIN.USERS, label: 'Users', icon: FiUsers },
  { path: ROUTES.ADMIN.COURSES, label: 'Courses', icon: FiBook },
  { path: ROUTES.ADMIN.INSTRUCTORS, label: 'Instructors', icon: FiUserCheck },
  { path: ROUTES.ADMIN.ORDERS, label: 'Orders', icon: FiShoppingCart },
];

export const AdminLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stroke fixed h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] top-16 md:top-20 overflow-y-auto z-40">
        <div className="p-4">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 pb-4 border-b border-stroke"
          >
            <FiHome size={18} />
            <span className="text-sm font-medium">Back to Site</span>
          </Link>
          <nav className="space-y-2">
            {adminNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 pt-16 md:pt-20 overflow-x-hidden">
        <div className="w-full max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

