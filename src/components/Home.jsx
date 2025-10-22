// Filename: src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import myFaceImage from '../assets/my-face.png';
import mlImage from '../assets/ml.png';
import webdevImage from '../assets/webdev.png';
import corepgmImage from '../assets/corepgm.png';


// Custom styles for the premium background effect
const customHomeStyles = `
  #home::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 50% 40% at 50% 40%, rgba(29, 78, 216, 0.15), transparent), #0A0A0B;
    z-index: -1;
  }
`;


const Home = () => {
  const [isShowing, setIsShowing] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => setIsShowing(true), 100);
    return () => clearTimeout(timer);
  }, []);


const gridItems = [
  { category: 'Machine Learning', title: 'Project Alpha', link: '#projects', image: mlImage },
  { category: 'Web Development', title: 'Project Beta', link: '#projects', image: webdevImage },
  { category: 'Core Programming', title: 'Project Gamma', size: 'col-span-2 h-[800px] max-lg:col-span-1 max-lg:h-[400px]', link: '#projects', image: corepgmImage },
];


  return (
    <section className="hero-section px-xl pt-[15vh] pb-[10vh] relative" id="home">
      <style>{customHomeStyles}</style>


      {/* HERO SECTION (Initial Load Animation) */}
      <Transition
        show={isShowing}
        appear={true}
        enter="transition-all duration-1000 ease-out"
        enterFrom="opacity-0 translate-y-10 scale-90"
        enterTo="opacity-100 translate-y-0 scale-100"
      >
        <div className="home-hero-content-wrapper mb-16 relative flex flex-col-reverse lg:flex-row items-center gap-8">
          {/* --- LEFT: Text --- */}
          <div className="flex-1">
            <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] font-semibold leading-snug max-w-[70%] max-lg:max-w-full mb-6">
              I'm <span className="accent-text font-bold">Amogh Hosamane</span>, Aspiring{' '}
              <span className="accent-text inline-block min-w-[180px]">
                <Typewriter
                  words={['Software Architect.', 'Backend Developer.', 'AI/ML engineer.']}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </span>
            </h1>
            {/* UPDATED: New introductory paragraph */}
            <p className="text-[1.1rem] sm:text-[1.2rem] md:text-[1.25rem] text-white/70 max-w-2xl max-lg:max-w-full">
              An aspiring Software Architect passionate about designing scalable and efficient software systems. I build robust backend solutions and explore AI/ML concepts to create intelligent, high-performance applications. I thrive on collaborating with teams and turning innovative ideas into impactful projects, while continuously learning and evolving in the tech world.
            </p>
          </div>


          {/* --- RIGHT: Face Image --- */}
          <Transition
            show={isShowing}
            appear={true}
            enter="transition-all duration-1200 ease-out"
            enterFrom="opacity-0 translate-x-20 scale-75 rotate-6"
            enterTo="opacity-100 translate-x-0 scale-100 rotate-0"
          >
            <div className="flex-1 relative w-full max-w-xs lg:max-w-sm mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-md animate-pulse"></div>
              <img
                src={myFaceImage}
                alt="Amogh Hosamane"
                className="relative z-10 w-full h-auto rounded-xl shadow-xl object-cover transition-transform duration-700 ease-out"
                style={{ maxHeight: '500px', backgroundColor: 'transparent' }}
              />
            </div>
          </Transition>
        </div>
      </Transition>


      {/* PORTFOLIO GRID with 3D TILT and SCROLL ANIMATIONS */}
      <section className="portfolio-grid grid grid-cols-2 max-lg:grid-cols-1 gap-px bg-white/10">
        {gridItems.map((item, index) => (
          <Tilt
            key={index}
            glareEnable={true}
            glareMaxOpacity={0.2}
            glarePosition="all"
            scale={1.02}
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            transitionSpeed={1500}
          >
            <motion.a
              href={item.link}
              className={`grid-item flex flex-col justify-end p-10 h-[600px] bg-dark relative overflow-hidden transition-all hover:bg-dark/95 hover:text-accent group border-b border-white/10 ${item.size || ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover z-1 transition-transform duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-60"
                />
              ) : (
                <div className="image-placeholder absolute inset-0 bg-white/5 z-1 transition-transform duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-60 flex items-center justify-center">
                  <span className="text-white/30 text-lg">Your Image Here</span>
                </div>
              )}
              <div className="project-info relative z-10">
                <span className="category text-sm text-white/70">{item.category}</span>
                <h2 className="text-4xl mt-1">{item.title}</h2>
              </div>
            </motion.a>
          </Tilt>
        ))}
      </section>
    </section>
  );
};


export default Home;