/**
 * Home Page component - Clean minimal design
 */

import { HeroSection } from '@/components/home/HeroSection';
import { CoursesSection } from '@/components/home/CoursesSection';

export const HomePage = () => {
  return (
    <div className="relative">
      {/* Hero Section - Full viewport height, covers entire screen */}
      <HeroSection />
      
      {/* Courses Section - Appears on scroll, positioned right after hero */}
      <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'white' }}>
        <CoursesSection />
      </div>
    </div>
  );
};

export default HomePage;
