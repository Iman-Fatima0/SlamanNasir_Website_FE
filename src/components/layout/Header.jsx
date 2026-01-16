/**
 * Header component - Minimal transparent design over hero
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  
  // Check page type for styling
  const isHomePage = location.pathname === ROUTES.HOME;
  const isCoursesPage = location.pathname === ROUTES.COURSES;
  
  // Determine text color based on page background
  // Brown pages (courses) use white text, others use dark text
  const isDarkPage = isHomePage || isCoursesPage;
  const textColor = isDarkPage ? 'text-white' : 'text-font-primary';
  const textColorHover = isDarkPage ? 'text-white/80 hover:text-white' : 'text-font-primary hover:text-primary';
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

  const navLinks = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: ROUTES.COURSES, label: 'Courses' },
    { path: ROUTES.INSTRUCTORS, label: 'Instructors' },
  ];

  const isActive = (path) => location.pathname === path;

  // Render transparent header on all pages
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Placeholder */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <div className={`w-10 h-10 backdrop-blur-sm border rounded-lg flex items-center justify-center ${
              isDarkPage 
                ? 'bg-white/20 border-white/30' 
                : 'bg-primary/20 border-primary/30'
            }`}>
              <span className={`font-bold text-lg ${textColor}`}>S</span>
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
                <Link
                  to={ROUTES.DASHBOARD}
                  className="bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                    transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                    shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                    hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                    focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] inline-block"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      logout();
                    }
                  }}
                  className="bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                    transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                    shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                    hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                    focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]"
                >
                  Logout
                </button>
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
                  <Link to={ROUTES.DASHBOARD} onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                      transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                      shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                      hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                      focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]">
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                      transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                      shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                      hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                      focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]"
                  >
                    Logout
                  </button>
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
