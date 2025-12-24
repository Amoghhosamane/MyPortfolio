import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import { Work, Projects, Skills, About, Contact } from './components/Sections';





// Loading spinner component
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[9999]">
    <style>{`
      .loader {
        width: 15px;
        aspect-ratio: 1;
        border-radius: 50%;
        animation: l5 1s infinite linear alternate;
      }
      @keyframes l5 {
          0%  {box-shadow: 20px 0 #3b82f6, -20px 0 #3b82f622; background: #3b82f6}
          33% {box-shadow: 20px 0 #3b82f6, -20px 0 #3b82f622; background: #3b82f622}
          66% {box-shadow: 20px 0 #3b82f622, -20px 0 #3b82f6; background: #3b82f622}
          100%{box-shadow: 20px 0 #3b82f622, -20px 0 #3b82f6; background: #3b82f6}
      }
    `}</style>
    <div className="loader"></div>
  </div>
);

const App = () => {
  const [activeHash, setActiveHash] = useState(window.location.hash || '#home');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      setLoading(true);
      const hash = window.location.hash || '#home';
      setActiveHash(hash);

      // Simulate loading delay
      setTimeout(() => {
        setLoading(false);
        window.scrollTo(0, 0);
      }, 600);
    };

    window.addEventListener('hashchange', onHashChange);

    // Initial load
    onHashChange();

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const renderSection = () => {
    switch (activeHash) {
      case '#work': return <Work />;
      case '#projects': return <Projects />;
      case '#skills': return <Skills />;
      case '#about': return <About />;
      // --- THIS LINE WAS MISSING ---
      case '#contact': return <Contact />;
      case '#home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark text-light relative">
      <Header activeHash={activeHash} />

      <main className="flex-grow relative">
        {loading && <LoadingSpinner />}
        {!loading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHash}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="min-h-[400px]" // to prevent layout shift
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
