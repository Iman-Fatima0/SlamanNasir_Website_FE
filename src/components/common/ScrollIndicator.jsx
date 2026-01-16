/**
 * Scroll Indicator Component
 * Shows a brown indicator that indicates scroll position and allows dragging to scroll
 */

import { useState, useEffect, useRef } from 'react';

export const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const dragStartY = useRef(0);
  const dragStartProgress = useRef(0);

  const calculateScrollProgress = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    const totalScrollableHeight = documentHeight - windowHeight;
    const progress = totalScrollableHeight > 0 
      ? (scrollTop / totalScrollableHeight) * 100 
      : 0;
    
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  useEffect(() => {
    window.addEventListener('scroll', calculateScrollProgress, { passive: true });
    calculateScrollProgress(); // Calculate initial position

    return () => {
      window.removeEventListener('scroll', calculateScrollProgress);
    };
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartProgress.current = scrollProgress;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const mouseY = e.clientY - containerRect.top;
      
      // Calculate new progress based on mouse position
      const newProgress = Math.min(100, Math.max(0, (mouseY / containerHeight) * 100));
      setScrollProgress(newProgress);

      // Scroll the page to match the progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const totalScrollableHeight = documentHeight - windowHeight;
      const newScrollTop = (newProgress / 100) * totalScrollableHeight;
      
      window.scrollTo({
        top: newScrollTop,
        behavior: 'auto', // Instant scroll when dragging
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="fixed right-6 z-50 cursor-pointer select-none" 
      style={{ top: '2rem', bottom: '2rem' }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`w-2 h-12 bg-secondary-dark rounded-full shadow-lg ${
          isDragging ? 'opacity-80' : 'transition-all duration-150 ease-out'
        }`}
        style={{
          position: 'absolute',
          top: `${scrollProgress}%`,
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  );
};

export default ScrollIndicator;

