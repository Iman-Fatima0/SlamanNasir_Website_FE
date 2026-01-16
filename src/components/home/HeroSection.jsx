/**
 * Hero Section component - Full viewport height with scroll animation
 */

import { useEffect, useState } from 'react';
import desertBg from '@/assets/images/wolfgang-hasselmann-pVr6wvUneMk-unsplash.jpg';

export const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate parallax effect - hero moves slower as you scroll
  const parallaxOffset = scrollY * 0.5;

  return (
    <section 
      className="relative h-screen flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: `url(${desertBg})`,
        backgroundSize: 'cover',
        backgroundPosition: `center ${parallaxOffset}px`,
        backgroundRepeat: 'no-repeat',
        transform: `translateY(${scrollY * 0.3}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)`
        }}></div>
      </div>

      {/* Content */}
      <div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`,
          opacity: Math.max(0, 1 - scrollY / 500), // Fade out as you scroll
        }}
      >
        <div className="max-w-4xl ml-auto text-right">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
            Learn Arabic the Right Way
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-10 text-gray-100 leading-relaxed max-w-2xl ml-auto font-light">
            Master Arabic language with comprehensive courses
            designed for all levels
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
