/**
 * Hero Section component - Full viewport height with scroll animation
 */

import { useEffect, useState } from 'react';
import desertBg from '@/assets/images/wolfgang-hasselmann-pVr6wvUneMk-unsplash.jpg';
import unionLogo from '@/assets/images/Union.png';
import { ScrollDownArrow } from '@/components/common/ScrollDownArrow';

export const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      className="relative flex items-center justify-center text-white overflow-hidden"
      style={{
        height: '100vh',
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${desertBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        transform: `translateY(${scrollY * 0.3}px)`,
        transition: 'transform 0.1s ease-out',
        zIndex: 0,
      }}
    >
      {/* Dark overlay for overall readability */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }}></div>
      
      {/* Subtle background pattern removed and bottom fade removed as requested */}

      {/* Content */}
      <div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative"
        style={{
          zIndex: 3,
          transform: `translateY(${scrollY * 0.2}px)`,
          opacity: Math.max(0, 1 - scrollY / 500), // Fade out as you scroll
        }}
      >
        <div className="max-w-4xl ml-auto text-right">
          <div className="mb-6 flex justify-end">
            <img 
              src={unionLogo} 
              alt="Salman Nasir Logo" 
              className="h-16 md:h-20 lg:h-24 xl:h-28 w-auto object-contain"
              style={{
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
              }}
            />
          </div>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-10 text-gray-100 leading-relaxed max-w-2xl ml-auto font-light">
            Master Arabic language with comprehensive courses
            designed for all levels
          </p>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <ScrollDownArrow />
    </section>
  );
};

export default HeroSection;
