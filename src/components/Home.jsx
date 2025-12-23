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
import openImage from '../assets/open.png';
import AnimatedSection from './AnimatedSection';


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
  { category: 'Machine Learning', title: 'Project Alpha', subtitle: 'click here to view projects', link: '#projects', image: mlImage },
  { category: 'Web Development', title: 'Project Beta', subtitle: 'click here to view projects', image: webdevImage },
  { category: 'Core Programming', title: 'Project Gamma', subtitle: 'click here to view projects', size: 'col-span-2 h-[800px] max-lg:col-span-1 max-lg:h-[400px]' , image: corepgmImage },
  { category: 'Open Source Contributor 2026', title: '10+ Projects contributed', subtitle: 'many more', size: 'col-span-2 h-[800px] max-lg:col-span-1 max-lg:h-[400px]', image: openImage },
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
              {item.subtitle ? (
                <p className="text-sm mt-2 text-white/60">{item.subtitle}</p>
              ) : null}
              </div>
            </motion.a>
          </Tilt>
        ))}
      </section>

    {/* Certificates section (moved below projects) */}
    <AnimatedSection>
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Certifications</h3>
        <div className="flex flex-wrap gap-3">
          {([
            { title: 'Nvidia - Certification', url: 'https://coursera.org/share/2e28f39fedef9792a6b0a31de40f264d', issuer: 'Coursera' },
            { title: 'AWS - certification', url: 'https://www.theforage.com/completion-certificates/pmnMSL4QiQ9JCgE3W/kkE9HyeNcw6rwCRGw_pmnMSL4QiQ9JCgE3W_6KwM5DaeEMWteEprr_1766218017786_completion_certificate.pdf', issuer: 'The Forage' },
            { title: 'Deloitte - certification', url: 'https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/udmxiyHeqYQLkTPvf_9PBTqmSxAf6zZTseP_6KwM5DaeEMWteEprr_1765053854242_completion_certificate.pdf', issuer: 'The Forage' },
            { title: 'Oracle - certification', url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=3F6777C3950287200568024C8DCEDCE8439C7794682DCFEF6E1044849EFA2384', issuer: 'Oracle university' },
            { title: 'Hackerrank - certification', url: 'https://www.hackerrank.com/certificates/044dc76c8648', issuer: 'Hackerrank' },
            { title: 'Google cloud - certification', url: 'https://simpli-web.app.link/e/LXxa7lUxkZb', issuer: 'Simplilearn|SkillUp' },
            // placeholder
            { title: 'Many more' },
          ]).map((cert, i) => {
            const link = cert.url || '#';
            const isDisabled = !cert.url;
            return (
              <a
                key={i}
                href={link}
                target={isDisabled ? '_self' : '_blank'}
                rel={isDisabled ? undefined : 'noopener noreferrer'}
                className={`inline-flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-transform duration-150 ${isDisabled ? 'bg-white/6 text-white/70 cursor-not-allowed' : 'bg-white text-dark hover:scale-105'}`}
                aria-label={`Open ${cert.title}`}
                onClick={(e) => { if (isDisabled) e.preventDefault(); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#111827" />
                </svg>
                <span>{cert.title}{cert.issuer ? <span className="ml-2 text-xs text-white/60">· {cert.issuer}</span> : null}</span>
              </a>
            );
            })}
        </div>
      </div>
    </AnimatedSection>
    </section>
  );
};



export default Home;