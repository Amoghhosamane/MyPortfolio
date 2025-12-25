import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// Custom CSS for the Shimmer effect AND the new spotlight button
const customHeaderStyles = `
@keyframes shimmer {
  0% { transform: translateX(-100%) skewX(-25deg); }
  100% { transform: translateX(300%) skewX(-25deg); }
}

.shimmer-element {
  content: '';
  position: absolute;
  top: 0; 
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
  transform: translateX(-100%) skewX(-25deg); 
  animation: shimmer 4s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: none;
  z-index: 5;
}

/* New Spotlight Button Styles */
.spotlight-btn {
  position: relative;
  overflow: hidden;
}

.spotlight-btn::before {
  content: '';
  position: absolute;
  left: var(--x, 50%);
  top: var(--y, 50%);
  width: 100px; /* Size of the spotlight */
  height: 100px;
  background-image: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%);
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.spotlight-btn:hover::before {
  opacity: 1;
}
`;

// GitHub SVG Icon Component
const GitHubIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.72-4.043-1.608-4.043-1.608-.546-1.386-1.332-1.755-1.332-1.755-1.09-.745.083-.728.083-.728 1.205.084 1.838 1.238 1.838 1.238 1.07 1.833 2.81 1.303 3.493.996.108-.775.418-1.303.762-1.603-2.67-.305-5.467-1.334-5.467-5.943 0-1.31.468-2.383 1.236-3.22-.124-.305-.536-1.52.117-3.176 0 0 1.008-.323 3.302 1.232 1.05-.29 2.16-.435 3.268-.44 1.107.005 2.217.15 3.268.44 2.294-1.555 3.302-1.232 3.302-1.232.653 1.656.24 2.87.118 3.176.77.837 1.233 1.91 1.233 3.22 0 4.62-2.8 5.633-5.475 5.934.426.37.817 1.102.817 2.22 0 1.605-.015 2.898-.015 3.28 0 .317.218.687.828.575C20.565 21.802 24 17.307 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);


const Header = ({ activeHash }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);
  const projectsBtnRef = useRef(null); // Ref for the projects button

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShow(false);
      } else {
        setShow(true);
      }
      lastScrollY.current = currentScrollY;
    };

    // Logic for the spotlight effect on the button
    const handleMouseMove = (e) => {
      if (projectsBtnRef.current) {
        const rect = projectsBtnRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        projectsBtnRef.current.style.setProperty('--x', `${x}px`);
        projectsBtnRef.current.style.setProperty('--y', `${y}px`);
      }
    };

    window.addEventListener('scroll', controlHeader);
    const btn = projectsBtnRef.current;
    if (btn) {
      btn.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('scroll', controlHeader);
      if (btn) {
        btn.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#work' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  const mobileNavLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#work' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  const renderNavLinks = (className) => (
    <nav className={clsx('nav', className)}>
      {navLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          onClick={() => setIsMobileMenuOpen(false)}
          className={clsx(
            'group relative px-2 py-1 text-white/80 hover:text-white transition-colors duration-300 font-medium',
            { 'text-white': link.href === activeHash }
          )}
        >
          {link.name}
          <span className={clsx("absolute left-0 bottom-0 h-0.5 bg-white transition-all duration-300", { "w-0 group-hover:w-full": link.href !== activeHash, "w-full": link.href === activeHash })}></span>
        </a>
      ))}
    </nav>
  );

  return (
    <>
      <header className={clsx(
        "fixed top-0 left-0 w-full z-50 bg-dark/70 backdrop-blur-lg border-b border-white/10 rounded-b-xl shadow-lg transition-transform duration-300 ease-in-out",
        { 'translate-y-0': show, '-translate-y-full': !show }
      )}>
        <style>{customHeaderStyles}</style>
        <div className="shimmer-element absolute inset-0"></div>

        <div className="py-4 relative z-10">
          <div className="px-xl flex justify-between items-center">
            <a href="#home" className="text-xl font-bold transition-color hover:text-accent">
              Portfolio
            </a>
            <div className="hidden lg:flex items-center gap-6">
              {renderNavLinks('flex gap-6')}
              <a href="https://github.com/AmoghHosamane" target="_blank" rel="noopener noreferrer" className="p-2 text-white/80 hover:text-accent transition-colors" aria-label="View GitHub profile">
                <GitHubIcon className="w-6 h-6" />
              </a>

              {/* UPDATED: "Case Studies" button leads to the detailed view page */}
              <a
                ref={projectsBtnRef}
                href="#work"
                className="spotlight-btn px-6 py-3 text-sm font-semibold rounded-[30px]
                         bg-black/50 text-white/90 
                         backdrop-blur-sm border border-white/20 
                         shadow-lg
                         transition-all duration-300 
                         hover:bg-black/70 hover:text-white 
                         active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Projects
              </a>
            </div>
            <button className="lg:hidden text-white/80 hover:text-accent" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <Transition show={isMobileMenuOpen} as={Fragment}>
        <div className="fixed inset-0 z-[100] lg:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-dark/95 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col p-8 border-l border-white/10 overflow-y-auto">
              <div className="flex items-center justify-between mb-12">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tighter text-white">PORTFOLIO</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">Navigation</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all active:scale-90"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {mobileNavLinks.map((link, idx) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      'group flex items-center justify-between text-xl font-bold py-4 transition-all duration-300 border-b border-white/5',
                      {
                        'text-accent pl-2': link.href === activeHash,
                        'text-white/40 hover:text-white hover:pl-2': link.href !== activeHash
                      }
                    )}
                  >
                    <span>{link.name}</span>
                    <svg
                      className={clsx("w-6 h-6 transition-all duration-300", {
                        "translate-x-0 opacity-100": link.href === activeHash,
                        "-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100": link.href !== activeHash
                      })}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto pt-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <a
                    href="#work"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center spotlight-btn px-6 py-5 text-lg font-bold rounded-2xl
                               bg-accent text-dark 
                               shadow-[0_10px_30px_rgba(45,212,191,0.2)]
                               hover:shadow-[0_15px_40px_rgba(45,212,191,0.3)]
                               active:scale-[0.98] transition-all"
                  >
                    Explore My Projects
                  </a>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <a
                      href="https://github.com/AmoghHosamane"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white/60 hover:text-accent transition-all border border-white/5"
                    >
                      <GitHubIcon className="w-5 h-5" />
                      <span className="text-sm font-semibold">GitHub</span>
                    </a>
                    <a
                      href="#contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white/60 hover:text-accent transition-all border border-white/5"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-semibold">Contact</span>
                    </a>
                  </div>

                  <p className="text-center text-[10px] text-white/20 mt-10 tracking-[0.3em] uppercase mb-4">
                    © 2026 AMOGH HOSAMANE
                  </p>
                </motion.div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </>
  );
};

export default Header;
