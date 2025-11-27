import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { problemData } from ".";
import '../index.css'

interface ProblemItem {
  title: string;
  solution: string;
  image: string;
}

const Problems: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-orange-600 via-amber-600 to-yellow-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 pb-32 sm:px-8 lg:px-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Welches Fettabscheiderprotokoll <br className="hidden lg:block" />
              Der Betreiber erledigt das für Sie?
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto font-medium">
              Betreiben Sie Ihr unternehmenskritisches Unternehmen besser<br />
              Effektiv und profitabel
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#fffbeb"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Unsere Lösungen für
          </h2>
          <div className="w-32 h-2 bg-linear-to-r from-orange-600 via-amber-500 to-yellow-500 mx-auto rounded-full"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
          {(problemData as ProblemItem[]).map((item: ProblemItem, idx: number) => (
            <div
              key={idx}
              className="relative group block p-2 h-full w-full"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Animated hover background */}
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.span
                    className="absolute inset-0 h-full w-full bg-linear-to-br from-orange-200 to-yellow-200 block rounded-3xl"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { duration: 0.15 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15, delay: 0.2 },
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Card */}
              <div className="relative z-20 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-8 border-orange-500 h-full">
                <div className="relative z-10 p-8">
                  {item.image && (
                    <div className="mb-6 flex items-center justify-center">
                      <div className="w-20 h-20 bg--to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    </div>
                  )}
                  <h3 className="text-xl font-extrabold text-gray-900 mb-4 leading-tight group-hover:text-orange-700 transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Divider */}
                  <div className="w-16 h-1 bg-linear-to-r from-orange-500 to-yellow-500 mb-4 rounded-full"></div>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed text-base group-hover:text-gray-900 transition-colors duration-300">
                    {item.solution}
                  </p>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-yellow-400 to-orange-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
   
      </div>
    </div>
  );
};

export default Problems;