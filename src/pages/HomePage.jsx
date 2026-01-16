/**
 * Home Page component - Clean minimal design
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { HeroSection } from '@/components/home/HeroSection';
import { CoursesSection } from '@/components/home/CoursesSection';
import pattern1 from '@/assets/images/pattern2.jpg';

export const HomePage = () => {
  const [patternTop, setPatternTop] = useState('50vh');

  useEffect(() => {
    const updatePatternPosition = () => {
      // Find the CoursesSection end and Footer start
      const coursesSection = document.querySelector('[data-section="courses"]');
      const footer = document.querySelector('footer');
      
      if (coursesSection && footer) {
        const coursesRect = coursesSection.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();
        // Calculate the boundary position in viewport coordinates (for fixed positioning)
        const boundaryY = (coursesRect.bottom + footerRect.top) / 2;
        setPatternTop(`${boundaryY}px`);
      }
    };

    // Initial calculation after a short delay to ensure DOM is ready
    const timer = setTimeout(updatePatternPosition, 100);
    
    // Update on scroll to keep it at the boundary
    window.addEventListener('scroll', updatePatternPosition, { passive: true });
    window.addEventListener('resize', updatePatternPosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', updatePatternPosition);
      window.removeEventListener('resize', updatePatternPosition);
    };
  }, []);

  // Pattern illustration portal - Vertical line above Footer
  const patternIllustration = createPortal(
    <div
      className="pattern-illustration"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: patternTop,
        transform: 'translateY(-50%)',
        zIndex: 1,
        pointerEvents: 'none',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      aria-hidden="true"
    >
      <img
        src={pattern1}
        alt="Decorative Pattern"
        className="pattern-illustration-img"
        style={{
          width: 'auto',
          height: '200px',
          objectFit: 'contain',
          opacity: 0.6,
          transform: 'rotate(90deg)',
          transformOrigin: 'center',
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))',
        }}
      />
      {/* Responsive styles */}
      <style>{`
        @media (min-width: 640px) {
          .pattern-illustration-img {
            height: 250px !important;
          }
        }
        @media (min-width: 1024px) {
          .pattern-illustration-img {
            height: 300px !important;
          }
        }
      `}</style>
    </div>,
    document.body
  );

  return (
    <>
      {patternIllustration}
      <div className="bg-white">
        {/* Hero Section - Full viewport height */}
        <HeroSection />
        
        {/* Courses Section - Appears on scroll */}
        <CoursesSection />
      </div>
    </>
  );
};

export default HomePage;
