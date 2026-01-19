/**
 * Footer component with Cleveland image background
 */

import { useLocation, Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { ROUTES } from '@/constants';
import clevelandImage from '@/assets/images/the-cleveland-museum-of-art-k0Z7EnXb1mU-unsplash.jpg';

export const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const isHomePage = location.pathname === ROUTES.HOME;

  // Determine background color based on route
  const getBackgroundColor = () => {
    if (
      location.pathname === ROUTES.COURSES ||
      location.pathname.startsWith(ROUTES.COURSE_DETAIL('').replace(':id', ''))
    ) {
      return 'bg-secondary-dark';
    }
    if (
      location.pathname === ROUTES.INSTRUCTORS ||
      location.pathname.startsWith(ROUTES.INSTRUCTOR_DETAIL('').replace(':id', ''))
    ) {
      return 'bg-gray-50';
    }
    if (location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGNUP) {
      return 'bg-white';
    }
    return 'bg-black';
  };

  const backgroundColor = getBackgroundColor();
  
  // Determine text color based on background
  const getTextColor = () => {
    if (isHomePage) {
      return 'text-gray-200'; // Darker white/grey-white for homepage
    }
    if (backgroundColor === 'bg-white' || backgroundColor === 'bg-gray-50') {
      return 'text-font-primary';
    }
    return 'text-white';
  };
  
  const textColor = getTextColor();

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
    <footer
      className={`relative overflow-visible ${
        isHomePage ? 'bg-transparent' : backgroundColor
      } ${textColor}`}
    >
      {/* Cleveland Image Background - Only on HomePage, extends upward and behind footer */}
      {isHomePage && (
        <div
          className="absolute left-0 right-0 w-full pointer-events-none cleveland-bg-container"
          style={{
            top: '-300px',
            bottom: 0,
            height: 'calc(100% + 300px)',
            zIndex: 0,
          }}
          aria-hidden="true"
        >
          {/* Top fade gradient - blends into courses section (BLACK FADE) */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: '200px',
              background:
                'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.2) 85%, rgba(0, 0, 0, 0) 100%)',
              zIndex: 2,
            }}
            aria-hidden="true"
          />

          {/* Background Image - full width, extends upward and covers entire footer */}
          <img
            src={clevelandImage}
            alt=""
            className="w-full h-full object-cover"
            style={{
              objectPosition: 'center bottom',
              zIndex: 1,
            }}
            draggable={false}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Footer Content - Overlay on top */}
      <div
        className={`relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 ${
          isHomePage ? 'pt-12 pb-20' : 'py-16'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className={`text-2xl font-bold mb-4 ${textColor}`}>Salman Nasir</h3>
            <p className={`text-sm ${textColor} ${isHomePage ? 'opacity-100' : 'opacity-80'}`}>
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
                    className={`text-sm ${textColor} ${isHomePage ? 'opacity-100 hover:text-gray-400' : 'opacity-80 hover:opacity-100'} transition-colors`}
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
                    className={`text-sm ${textColor} ${isHomePage ? 'opacity-100 hover:text-gray-400' : 'opacity-80 hover:opacity-100'} transition-colors`}
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
                    className={`text-sm ${textColor} ${isHomePage ? 'opacity-100 hover:text-gray-400' : 'opacity-80 hover:opacity-100'} transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`mt-10 pt-6 pb-8 border-t ${
            textColor === 'text-white' ? 'border-white/15' : 'border-gray-300'
          } flex flex-col md:flex-row items-center justify-between gap-4`}
        >
          <div className="flex space-x-4 mb-4 md:mb-0">
            {socialLinks.map(({ icon: Icon, url, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`${textColor} ${isHomePage ? 'opacity-100 hover:text-gray-400' : 'opacity-70 hover:opacity-100'} transition-colors`}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

          <p className={`text-sm ${textColor} ${isHomePage ? 'opacity-100' : 'opacity-60'}`}>
            © {currentYear} Salman Nasir. All rights reserved.
          </p>
        </div>
      </div>

      {/* Responsive styles for Cleveland image */}
      {isHomePage && (
        <style>{`
          .cleveland-bg-container {
            top: -250px !important;
            height: calc(100% + 250px) !important;
          }
          @media (min-width: 640px) {
            .cleveland-bg-container {
              top: -280px !important;
              height: calc(100% + 280px) !important;
            }
          }
          @media (min-width: 1024px) {
            .cleveland-bg-container {
              top: -300px !important;
              height: calc(100% + 300px) !important;
            }
          }
        `}</style>
      )}
    </footer>
  );
};

export default Footer;

