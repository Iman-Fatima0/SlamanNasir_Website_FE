/**
 * User Dashboard Page component
 */

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { FiUser, FiBook, FiSettings, FiLogOut } from 'react-icons/fi';
import { ROUTES } from '@/constants';

const DashboardContent = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-12 pt-24 md:pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Dashboard</h1>
          <p className="text-xl text-gray-200">Welcome back, {user?.firstName || 'User'}!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-stroke p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stroke">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-semibold text-font-primary">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-sm text-gray-600">{user?.email}</div>
                </div>
              </div>
              <nav className="space-y-2">
                <Link
                  to={ROUTES.DASHBOARD}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium"
                >
                  <FiUser />
                  <span>Profile</span>
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-stroke transition-colors"
                >
                  <FiBook />
                  <span>My Courses</span>
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-stroke transition-colors"
                >
                  <FiSettings />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-stroke p-8">
              <h2 className="text-2xl font-bold text-font-primary mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                  <div className="text-lg text-font-primary">{user?.firstName || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                  <div className="text-lg text-font-primary">{user?.lastName || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <div className="text-lg text-font-primary">{user?.email || 'N/A'}</div>
                </div>
                <div className="pt-4">
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div className="bg-white rounded-xl shadow-sm border border-stroke p-8 mt-8">
              <h2 className="text-2xl font-bold text-font-primary mb-6">My Courses</h2>
              <div className="text-center py-12">
                <FiBook className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
                <Link to={ROUTES.COURSES}>
                  <Button variant="primary">Browse Courses</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};

export default DashboardPage;

