/**
 * About Salman Page
 * Replaces the public Instructors page with an about page
 */

export const AboutSalmanPage = () => {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Hero / Intro */}
      <section className="pt-24 md:pt-32 pb-16 bg-gradient-to-b from-black via-black to-secondary-dark/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-secondary-light tracking-[0.3em] uppercase text-xs mb-4">
              About
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Salman Nasir
            </h1>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Salman Nasir is dedicated to helping students around the world
              learn the Arabic language with clarity, beauty, and depth. This
              platform brings together carefully structured courses, classical
              texts, and modern teaching methods to make Arabic accessible for
              everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Vision &amp; Approach</h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              The vision behind this academy is to create a calm, respectful
              learning space that reflects the elegance of the Arabic language
              and Islamic tradition. Each course is designed to build strong
              fundamentals while keeping the experience simple and focused.
            </p>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Rather than overwhelming students with too many features, the
              platform focuses on clarity: clear lessons, clear progress, and a
              clean interface that keeps your attention on the words and their
              meanings.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">What You&apos;ll Find Here</h2>
            <ul className="space-y-4 text-gray-300 text-sm md:text-base">
              <li>
                <span className="font-semibold text-secondary-light">
                  Structured Courses:
                </span>{' '}
                Step-by-step curriculum for beginners, intermediate, and
                advanced learners.
              </li>
              <li>
                <span className="font-semibold text-secondary-light">
                  Clear Explanations:
                </span>{' '}
                Lessons that summarize, simplify, and highlight what really
                matters.
              </li>
              <li>
                <span className="font-semibold text-secondary-light">
                  Respectful Aesthetic:
                </span>{' '}
                A visual design inspired by classical Islamic art and calm,
                minimal interfaces.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSalmanPage;


