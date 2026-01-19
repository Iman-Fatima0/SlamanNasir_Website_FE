/**
 * Featured Courses Section - Vakil Mosque gallery style with scroll animation
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CoursesService } from '@/services';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { ROUTES } from '@/constants';

export const CoursesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['featuredCourses'],
    queryFn: () => CoursesService.getFeaturedCourses(4), // Get 4 courses for gallery
  });

  const courses = data?.data?.courses || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '-100px 0px', // Start animation slightly before it's fully visible
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      data-section="courses"
      className={`pt-20 lg:pt-32 pb-32 lg:pb-40 mb-16 lg:mb-24 bg-black relative overflow-visible transition-all duration-1000 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-20'
      }`}
    >
      {/* Blurred top edge for blending with hero section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-sm z-0"></div>
      
      {/* Additional blur overlay for seamless blend */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 z-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      ></div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Black Frame Container */}
        <div className="bg-black rounded-2xl p-8 md:p-10 lg:p-16">
          {isLoading && (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && (
            <ErrorMessage
              message={error.message || 'Failed to load featured courses. Please try again later.'}
              className="max-w-2xl mx-auto mb-8"
            />
          )}

          {!isLoading && !error && courses.length > 0 && (
            <>
              {/* Courses Gallery - Horizontal Layout */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 transition-all duration-1000 delay-300 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}>
                {courses.map((course, index) => (
                  <Link
                    key={course.id}
                    to={ROUTES.COURSE_DETAIL(course.id)}
                    className={`group relative block overflow-hidden rounded-lg transition-all duration-700 ${
                      isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-10'
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Course Image Container - Vertical Portrait */}
                    <div className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title || 'Course image'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary-light">
                          <div className="text-white text-8xl font-bold opacity-30">
                            {course.title?.charAt(0) || 'ع'}
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                      {/* Course Title Overlay at Bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
                        <h3 className="text-white text-lg md:text-xl font-bold mb-2 line-clamp-2">
                          {course.title || 'Course Title'}
                        </h3>
                        {course.instructor?.name && (
                          <p className="text-gray-300 text-sm">
                            {course.instructor.name}
                          </p>
                        )}
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300"></div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All Button - Neumorphic Style */}
              <div className={`text-center mt-8 mb-4 transition-all duration-1000 delay-500 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}>
                <Link to={ROUTES.COURSES} className="inline-block">
                  <button className="bg-secondary-dark rounded-[50px] text-white cursor-pointer text-sm py-2.5 px-6
                    transition-all duration-200 ease-in-out border-2 border-secondary-dark/80
                    shadow-[inset_3px_3px_8px_rgba(0,0,0,0.3),inset_-3px_-3px_8px_rgba(255,255,255,0.1)]
                    hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
                    focus:outline-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.15),2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]">
                    View All Courses
                  </button>
                </Link>
              </div>
            </>
          )}

          {!isLoading && !error && courses.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-block p-8 bg-gray-900 rounded-xl">
                <p className="text-gray-400 text-lg">No courses available at the moment.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
