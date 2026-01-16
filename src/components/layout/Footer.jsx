/**
 * Footer component
 */

import { Link, useLocation } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { ROUTES } from '@/constants';

export const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const isHomePage = location.pathname === ROUTES.HOME;

  // Determine background color based on route
  const getBackgroundColor = () => {
    if (location.pathname === ROUTES.COURSES || location.pathname.startsWith(ROUTES.COURSE_DETAIL('').replace(':id', ''))) {
      return 'bg-secondary-dark';
    }
    if (location.pathname === ROUTES.INSTRUCTORS || location.pathname.startsWith(ROUTES.INSTRUCTOR_DETAIL('').replace(':id', ''))) {
      return 'bg-gray-50';
    }
    if (location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGNUP) {
      return 'bg-white';
    }
    return 'bg-black'; // Homepage default
  };

  const backgroundColor = getBackgroundColor();
  const textColor = backgroundColor === 'bg-white' || backgroundColor === 'bg-gray-50' 
    ? 'text-font-primary' 
    : 'text-white';

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Careers', path: '/careers' },
    ],
    resources: [
      { label: 'Courses', path: ROUTES.COURSES },
      { label: 'Instructors', path: ROUTES.INSTRUCTORS },
      { label: 'Blog', path: '/blog' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
    ],
  };

  const socialLinks = [
    { icon: FiFacebook, url: 'https://facebook.com', label: 'Facebook' },
    { icon: FiTwitter, url: 'https://twitter.com', label: 'Twitter' },
    { icon: FiInstagram, url: 'https://instagram.com', label: 'Instagram' },
    { icon: FiLinkedin, url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className={`relative overflow-visible ${isHomePage ? 'bg-black' : backgroundColor} ${textColor}`}>
        {/* Footer content */}
      <div className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 ${isHomePage ? 'pt-24 pb-16' : 'py-16'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div>
            <h3 className={`text-2xl font-bold mb-4 ${textColor}`}>Salman Nasir</h3>
            <p className={`text-sm ${textColor} opacity-80`}>
              Learn Arabic with expert instructors. Master the language through
              comprehensive courses designed for all levels.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className={`font-semibold mb-4 ${textColor}`}>Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm ${textColor} opacity-80 hover:opacity-100 transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={`font-semibold mb-4 ${textColor}`}>Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm ${textColor} opacity-80 hover:opacity-100 transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`font-semibold mb-4 ${textColor}`}>Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm ${textColor} opacity-80 hover:opacity-100 transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`mt-10 pt-6 border-t ${textColor === 'text-white' ? 'border-white/15' : 'border-gray-300'} flex flex-col md:flex-row items-center justify-between gap-4`}>
          <div className="flex space-x-4">
            {socialLinks.map(({ icon: Icon, url, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`${textColor} opacity-70 hover:opacity-100 transition-colors`}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

          <p className={`text-sm ${textColor} opacity-60`}>
            © {currentYear} Salman Nasir. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
