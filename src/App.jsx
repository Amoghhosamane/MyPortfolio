import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import { Work, Projects, Skills, About, Contact } from './components/Sections';
import Experience from './components/Experience';
import AdminPanel from './components/AdminPanel';





const App = () => {
  const [activeHash, setActiveHash] = useState(window.location.hash || '#home');

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash || '#home';
      setActiveHash(hash);

      if (hash === '#experience') {
        setTimeout(() => {
          const el = document.getElementById('experience');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        window.scrollTo(0, 0);
      }
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
      case '#contact': return <Contact />;
      case '#experience': return <Home />;
      case '#admin': return <AdminPanel />;
      case '#home':
      default:
        return <Home />;
    }
  };

  // Admin panel takes full screen — no header/footer
  if (activeHash === '#admin') {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark text-light relative">
      <Header activeHash={activeHash} />

      <main className="flex-grow relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeHash}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="min-h-[400px]"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default App;
