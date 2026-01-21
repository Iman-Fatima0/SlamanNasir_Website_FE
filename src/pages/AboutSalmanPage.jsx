/**
 * About Salman Page
 * Portfolio-style layout with hero card and content sections
 */

export const AboutSalmanPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f0e8] -mt-16 pt-16 md:-mt-20 md:pt-20 text-[#1f130c]">
      {/* Hero card - three column layout like reference */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="bg-[#f8f4ec] rounded-3xl shadow-xl border border-[#e1d7c8] overflow-hidden px-6 py-7 md:px-10 md:py-9">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr),minmax(0,1.1fr),minmax(0,0.8fr)] gap-8 md:gap-10 items-center">
              {/* Left text column */}
              <div className="space-y-3 md:space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  Hey, I&apos;m Salman,
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-tight">
                  Arabic &amp; Quran Instructor
                </h1>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-600">
                  Teaching Arabic with clarity, calm, and depth.
                </p>
              </div>

              {/* Center image with circular background */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Circle background */}
                  <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-[#e5dfd3] shadow-inner" />
                  {/* Portrait placeholder */}
                  <div className="absolute inset-3 md:inset-4 rounded-[30px] overflow-hidden bg-gray-200 flex items-center justify-center shadow-md">
                    <span className="text-gray-500 text-xs md:text-sm">
                      Portrait coming soon
                    </span>
                  </div>
                </div>
              </div>

              {/* Right stats column */}
              <div className="space-y-6 text-xs md:text-sm text-gray-700">
                <div className="space-y-2">
                  <p className="font-semibold text-[#1f130c] text-base md:text-lg">
                    10+ Years
                  </p>
                  <p className="text-gray-600">
                    of teaching Arabic and Quran to students across the globe.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-[#1f130c] text-base md:text-lg">
                    280+ Students
                  </p>
                  <p className="text-gray-600">
                    from beginners to advanced learners, progressing lesson by lesson.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-[#1f130c] text-base md:text-lg">
                    95% Satisfaction
                  </p>
                  <p className="text-gray-600">
                    based on feedback from cohorts who completed full programmes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl grid gap-10 md:gap-14 md:grid-cols-[minmax(0,0.9fr),minmax(0,1.2fr)]">
          {/* Left heading */}
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-600">
              Crafting meaningful learning experiences
            </p>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h2>
          </div>

          {/* Right body */}
          <div className="space-y-4 text-sm md:text-base text-gray-700 leading-relaxed">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis
              unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
              et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
              sed quia consequuntur magni dolores eos qui ratione voluptatem sequi
              nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio-style section */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-6">
          <h3 className="text-sm font-semibold tracking-[0.25em] uppercase text-gray-600">
            Portfolio
          </h3>
          <div className="bg-[#f8f4ec] rounded-3xl shadow-md border border-[#e1d7c8] overflow-hidden">
            <div className="h-56 md:h-72 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm md:text-base">
                Featured work preview coming soon
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSalmanPage;


