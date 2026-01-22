/**
 * Header component - Minimal transparent design over hero
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import unionLogo from '@/assets/images/Union.png';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const profileMenuRef = useRef(null);
  
  // Check page type for styling
  const isHomePage = location.pathname === ROUTES.HOME;
  const isCoursesPage = location.pathname === ROUTES.COURSES;
  const isCourseDetailPage = location.pathname.startsWith('/courses/');
  
  // Determine text color based on page background
  // Dark pages (home, courses list) use white text
  // Course detail page should use dark brown text
  const isDarkPage = (isHomePage || isCoursesPage) && !isCourseDetailPage;
  const textColor = isCourseDetailPage ? 'text-[#2B211A]' : (isDarkPage ? 'text-white' : 'text-font-primary');
  const textColorHover = isCourseDetailPage
    ? 'text-[#2B211A] hover:text-primary'
    : (isDarkPage ? 'text-white/80 hover:text-white' : 'text-font-primary hover:text-primary');
  const textShadow = isDarkPage ? { textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' } : {};

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide navbar when scrolling down (but not at the very top)
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleDashboardClick = () => {
    setShowProfileMenu(false);
    navigate(ROUTES.DASHBOARD);
  };

  const handleLogoutClick = () => {
    setShowProfileMenu(false);
    logout();
  };

  const navLinks = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: ROUTES.COURSES, label: 'Courses' },
    { path: ROUTES.ABOUT, label: 'About Salman' },
  ];

  const isActive = (path) => location.pathname === path;

  // Render transparent header on all pages
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ backgroundColor: 'transparent', background: 'transparent' }}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'transparent' }}>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <div className="h-10 md:h-12 w-auto flex items-center">
              <img
                src={unionLogo}
                alt="Salman Nasir"
                className="h-full w-auto object-contain drop-shadow-md"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-2 py-2 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? textColor
                    : textColorHover
                }`}
                style={textShadow}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    isDarkPage ? 'bg-white' : 'bg-primary'
                  }`}></span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center">
            {/* Sign In Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to={ROUTES.ADMIN.DASHBOARD}
                    className="bg-primary rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                      transition-all duration-200 ease-in-out border-2 border-primary/80
                      shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                      hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                      focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] inline-block"
                  >
                    Admin
                  </Link>
                )}
                {/* Profile Icon with Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary-dark text-white cursor-pointer
                      transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                      shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                      hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                      focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]"
                    >
                      {user?.firstName ? (
                        <span className="text-sm font-medium">
                          {user.firstName.charAt(0).toUpperCase()}
                          {user.lastName?.charAt(0).toUpperCase() || ''}
                        </span>
                      ) : (
                        <FiUser size={18} />
                      )}
                    </button>
                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={handleDashboardClick}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                          >
                            <FiUser size={16} />
                            <span>Dashboard</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleLogoutClick}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <FiLogOut size={16} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                  transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                  shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                  hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                  focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] inline-block"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 ${textColor}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            style={textShadow}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={`md:hidden pb-4 border-t ${
            isDarkPage ? 'border-white/20' : 'border-stroke'
          }`}>
            <div className="flex flex-col space-y-4 pt-4">
              {/* Navigation Links Mobile */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative px-3 py-2 text-base font-medium ${
                    isActive(link.path)
                      ? textColor
                      : textColorHover
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className={`absolute left-0 top-0 bottom-0 w-1 ${
                      isDarkPage ? 'bg-white' : 'bg-primary'
                    }`}></span>
                  )}
                </Link>
              ))}

              {/* Sign In Mobile */}
              {isAuthenticated ? (
                <div className="space-y-2">
                  {isAdmin && (
                    <Link to={ROUTES.ADMIN.DASHBOARD} onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full bg-primary rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                        transition-all duration-200 ease-in-out border-2 border-primary/80
                        shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                        hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                        focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]">
                        Admin
                      </button>
                    </Link>
                  )}
                  {/* Profile Section Mobile */}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex items-center gap-3 mb-3 px-2">
                      <div className="w-10 h-10 rounded-full bg-secondary-dark text-white flex items-center justify-center
                        shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]">
                        {user?.firstName ? (
                          <span className="text-sm font-medium">
                            {user.firstName.charAt(0).toUpperCase()}
                            {user.lastName?.charAt(0).toUpperCase() || ''}
                          </span>
                        ) : (
                          <FiUser size={18} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">
                          {user?.firstName} {user?.lastName || ''}
                        </div>
                        <div className="text-xs text-gray-300">{user?.email}</div>
                      </div>
                    </div>
                    <Link to={ROUTES.DASHBOARD} onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                        transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                        shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                        hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                        focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                        flex items-center justify-center gap-2">
                        <FiUser size={16} />
                        <span>Dashboard</span>
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full mt-2 bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                        transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                        shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                        hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                        focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                        flex items-center justify-center gap-2"
                    >
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link to={ROUTES.LOGIN} onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                    transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                    shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                    hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                    focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
