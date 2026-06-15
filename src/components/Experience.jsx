import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';

// Map color class strings → Tailwind-safe classes
// (Tailwind needs full class names present in source for purging)
const COLOR_MAP = {
  'border-blue-400': 'border-blue-400',
  'border-emerald-400': 'border-emerald-400',
  'border-yellow-400': 'border-yellow-400',
  'border-purple-400': 'border-purple-400',
  'border-teal-400': 'border-teal-400',
  'border-pink-400': 'border-pink-400',
  'border-red-400': 'border-red-400',
  'border-orange-400': 'border-orange-400',
  'border-cyan-400': 'border-cyan-400',
};

const IconLocation = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block mr-1 opacity-60"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block mr-1 opacity-60"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Experience = () => {
  const { data, loading } = usePortfolioData();

  const experiences = (data.experiences || [])
    .filter((e) => e.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section id="experience" className="scroll-mt-28 py-16 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold pb-1 mb-2">
            Experience
          </h2>
          <p className="text-sm text-white/60">
            Research Internships & Professional Engagements
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce mr-2" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce mr-2" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {/* Timeline layout */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-white/10 hidden sm:block" />

              <div className="flex flex-col gap-8">
                {experiences.map((exp, index) => {
                  const borderColor = COLOR_MAP[exp.color] || 'border-teal-400';
                  return (
                    <motion.article
                      key={exp.id || index}
                      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                      className={`relative sm:ml-12 py-6`}
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-[3.45rem] top-8 hidden sm:flex items-center justify-center w-5 h-5 rounded-full border-2 bg-black ${borderColor}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${borderColor.replace('border-', 'bg-')}`} />
                      </div>

                      {/* Card header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{exp.org}</h3>
                          <p className="text-teal-400 font-semibold text-base">{exp.role}</p>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-white/60 shrink-0">
                          <span>
                            <IconClock />
                            {exp.duration}
                          </span>
                          {exp.location && (
                            <span>
                              <IconLocation />
                              {exp.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bullets */}
                      <ul className="list-none space-y-1.5 mb-5">
                        {(exp.bullets || []).map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/70 text-sm leading-relaxed">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>

                      {/* Tech stack tags */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800">
                        {(exp.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1 font-medium border border-white/10 rounded-full text-white/80 bg-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Experience;
