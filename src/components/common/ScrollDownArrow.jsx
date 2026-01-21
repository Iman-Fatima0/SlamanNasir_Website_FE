/**
 * Scroll Down Arrow Component
 * Animated arrow that appears at the bottom of the hero section
 * and disappears as the user scrolls
 */

import { useEffect, useState } from 'react';

export const ScrollDownArrow = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const gradientId = `brownGradient-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      // Hide arrow after scrolling 100px
      setIsVisible(currentScrollY < 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
      onClick={handleClick}
      style={{
        opacity: Math.max(0, 1 - scrollY / 100),
        transition: 'opacity 0.3s ease-out',
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-bounce-down"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))',
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A574" stopOpacity="1" />
            <stop offset="30%" stopColor="#B8956A" stopOpacity="1" />
            <stop offset="70%" stopColor="#8B6F47" stopOpacity="1" />
            <stop offset="100%" stopColor="#6B5234" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* V-shaped chevron pointing down */}
        <path
          d="M14 20 L24 32 L34 20"
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default ScrollDownArrow;
