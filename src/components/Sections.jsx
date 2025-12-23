import React, { useState, useEffect } from 'react';
// Corrected Firebase imports to use CDN paths for single-file environment compatibility
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import AnimatedSection from './AnimatedSection';
import { FaLinkedin as LinkedIn, FaGithub as GitHub, FaTwitter as X } from "react-icons/fa";


// --- Placeholder Icon for Case Study Links ---
const IconArrowRight = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

// --- Project Data (Used for both Work and Projects sections) ---
const newProjectsData = [
  {
    title: 'FNOL AI Orchestrator (Copilot Dev Camp Winner)',
    descShort: 'First Place 🥇 solution in a 90-minute Ideathon: A multi-agent Copilot system automating insurance claims (First Notice of Loss).',
    descLong: (
      <>
        <p className="text-white/70 mb-3">First Place 🥇 Winner at the Microsoft Copilot Developer Camp Pune Ideathon (90-minute challenge). Developed a high-impact, multi-agent Copilot system to automate the First Notice of Loss (FNOL) process in insurance.</p>
        <p className="text-white/70 mb-3 font-semibold">The solution reduced manual claims processing time from hours/days to automated execution in seconds.</p>
        <h4 className="text-white font-medium mt-4 mb-2">Multi-Agent Architecture:</h4>
        <ul className="list-disc ml-6 space-y-1">
          <li>Central Orchestrator: Manages the entire claim workflow, calling specialized agents.</li>
          <li>Data Validation Agent: Verifies policy and claimant information integrity.</li>
          <li>Damage Severity Agent: Analyzes provided data/images to estimate damage level.</li>
          <li>Duplicate Detection Agent: Identifies potential fraudulent or redundant claims.</li>
          <li>Estimation Agent: Provides an initial, automated claim cost projection.</li>
        </ul>
      </>
    ),
    tags: ['Copilot Studio', 'Multi-Agent AI', 'Enterprise Automation', 'InsuranceTech', 'Workflow Orchestration'],
    category: 'AI/Automation',
    color: 'border-yellow-400', // Gold color for winning project
  },

  {
    title: 'Heart Disease Prediction Model',
    descShort: 'Developed and evaluated ML models (Decision Trees, Logistic Regression, Random Forest, SVM) to predict heart disease.',
    descLong: (
      <>
        <p className="text-white/70 mb-3">Developed and evaluated ML models (Decision Trees, Logistic Regression, Random Forest, SVM) to predict heart disease using 11 clinical features.</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Achieved upto 90% test accuracy with Logistic Regression.</li>
          <li>Built an interactive Streamlit UI supporting bulk predictions with real-time visualization using Plotly.</li>
          <li>Deployed the application on Streamlit Community Cloud.</li>
        </ul>
      </>
    ),
    tags: ['Python', 'scikit-learn', 'Streamlit', 'Plotly'],
    category: 'Machine Learning',
    color: 'border-red-500',
  },
  {
    title: 'Crypto Responsive Web Tracker',
    descShort: 'Developed a responsive cryptocurrency tracking website displaying real-time prices using the CoinGecko public API.',
    descLong: (
      <>
        <p className="text-white/70 mb-3">Developed a responsive cryptocurrency tracking website that displays real-time price updates for Bitcoin, Ethereum, and Dogecoin.</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Integrated AJAX for asynchronous data fetching to ensure live updates without page reloads.</li>
          <li>Used JavaScript and jQuery for DOM manipulation and interactive UI elements.</li>
          <li>Gained hands-on experience in REST APIs and responsive web design best practices.</li>
        </ul>
      </>
    ),
    tags: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'CoinGecko API'],
    category: 'Web Development',
    color: 'border-green-500',
  },
  {
    title: 'Snake Game',
    descShort: 'Developed a classic Snake Game using Java with Swing and AWT libraries for GUI and event handling.',
    descLong: (
      <>
        <p className="text-white/70 mb-3">Developed a classic Snake Game using Java with Swing and AWT libraries for GUI and event handling.</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Implemented keyboard controls for smooth, responsive movement.</li>
          <li>Built a real-time scoring system.</li>
          <li>Strengthened understanding of object-oriented programming (OOP) and game loops.</li>
        </ul>
      </>
    ),
    tags: ['Java', 'Swing', 'AWT', 'OOP'],
    category: 'Core Programming',
    color: 'border-blue-500',
  },

  {
  title: 'Exoplanet Detection with ML (Kepler / K2 / TESS)',
  descShort: 'Built an ML pipeline to classify transit signals (planet / candidate / false positive) using NASA Kepler, K2, and TESS public datasets.',
  descLong: (
    <>
      <p className="text-white/70 mb-3">
        Developed a full ML pipeline to automatically identify exoplanet transit signals using open-source datasets from Kepler, K2, and TESS.
        This project covers data ingestion, feature engineering from light curves, model training, evaluation, and an interactive demo for exploring predictions.
      </p>
    

    <h4 className="text-white font-medium mt-4 mb-2">ML Pipeline for Transit Detection: </h4>
    
      <ul className="list-disc ml-6 space-y-1">
        <li>Preprocessed raw light curves (detrending, outlier removal) and engineered features (period, transit depth/duration, folded light-curve statistics).</li>
        <li>Compared classical ML models (Random Forest, XGBoost) and deep models (1D CNN on folded lightcurves) tuned via cross-validation.</li>
        <li>Evaluation focused on Precision, Recall, F1-score, and ROC-AUC to minimize false positives.</li>
        <li>Deployed a Streamlit demo to visualize light curves and show model predictions for new targets; code available on GitHub.</li>
      </ul>
    </>
  ),
  tags: ['Python', 'scikit-learn', 'XGBoost', 'TensorFlow', 'Lightkurve', 'AstroPy', 'Streamlit', 'Data Science'],
  category: 'Machine Learning',
  color: 'border-pink-500',
},

{
  title: 'AI Knowledge Retrieval RAG System',
  descShort: 'Implemented a Retrieval-Augmented Generation (RAG) system using vector databases to enable contextual questioning over private documents.',
  descLong: (
    <>
      <p className="text-white/70 mb-3">
        Built a powerful RAG system to overcome the knowledge cut-off limits of standard Large Language Models (LLMs). This allows users to ask complex questions based on proprietary or recently updated documents.
      </p>
    
   
      <h4 className="text-white font-medium mt-4 mb-2">RAG Architecture Flow: 

[Image of Retrieval-Augmented Generation RAG diagram]
</h4>
    
      <ul className="list-disc ml-6 space-y-1">
        <li>Data Ingestion & Embedding: Used LangChain to chunk documents and convert text into high-dimensional vectors (embeddings) stored in a Chroma vector database.</li>
        <li>Retrieval: When a query is received, the vector store performs a similarity search to find the most relevant document chunks.</li>
        <li>Augmentation & Generation: The retrieved context, along with the user query, is passed to an LLM (e.g., GPT-3.5) to generate a grounded, accurate, and non-hallucinatory answer.</li>
        <li>Demonstrated high accuracy in answering complex, domain-specific questions outside the LLM's original training data.</li>
      </ul>
    </>
  ),
  tags: ['LLM', 'RAG', 'LangChain', 'ChromaDB', 'Vector Database', 'Python', 'Contextual AI'],
  category: 'AI/GenAI',
  color: 'border-cyan-500',
},

{
  title: 'Exoplanet Detection with ML (Kepler / K2 / TESS)',
  descShort: 'Built an ML pipeline to classify transit signals (planet / candidate / false positive) using NASA Kepler, K2, and TESS public datasets.',
  descLong: (
    <>
      <p className="text-white/70 mb-3">
        Developed a full ML pipeline to automatically identify exoplanet transit signals using open-source datasets from Kepler, K2, and TESS.
        This project covers data ingestion, feature engineering from light curves, model training, evaluation, and an interactive demo for exploring predictions.
      </p>
      <ul className="list-disc ml-6 space-y-1">
        <li>Preprocessed raw light curves (detrending, outlier removal) and engineered features (period, transit depth/duration, folded light-curve statistics).</li>
        <li>Compared classical ML models (Random Forest, XGBoost) and deep models (1D CNN on folded lightcurves) tuned via cross-validation.</li>
        <li>Evaluation focused on Precision, Recall, F1-score, and ROC-AUC to minimize false positives.</li>
        <li>Deployed a Streamlit demo to visualize light curves and show model predictions for new targets; code available on GitHub.</li>
      </ul>
    </>
  ),
  tags: ['Python', 'scikit-learn', 'XGBoost', 'TensorFlow', 'Lightkurve', 'AstroPy', 'Streamlit', 'Data Science'],
  category: 'Machine Learning',
  color: 'border-pink-500',
}


];


// --- Work Section Component (Rebuilt without Tilt/Motion) ---
const Work = () => {
  return (
    <section id="work" className="p-8 md:p-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 id="work-title" className="text-4xl md:text-5xl font-extrabold pb-2 mb-4 border-b-4 border-indigo-500/50 inline-block">
          Selected Work
        </h2>
        <p className="work-intro max-w-3xl text-white/75 text-lg mb-12">
          A focused set of technical engagements across Machine Learning, Web Development, and Core Programming.
        </p>

        <div className="work-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {newProjectsData.map((card, index) => (
            <article
              key={index}
              className={`
                work-card border-l-4 ${card.color} rounded-xl p-7 bg-gray-800 h-full
                shadow-xl transition-all duration-300 ease-in-out cursor-pointer
                hover:shadow-2xl hover:scale-[1.03] hover:bg-gray-700/50
              `}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <p className="text-white/70 mb-6 flex-grow">{card.descShort}</p>
              
              <div className="work-meta flex gap-2 flex-wrap mb-4 mt-auto pt-4 border-t border-gray-700">
                {card.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="tag text-xs px-3 py-1 font-medium border border-indigo-600 rounded-full text-indigo-300 bg-indigo-900/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a 
                href="#projects" 
                aria-label={`View ${card.title} case study`} 
                className="inline-flex items-center gap-1 mt-2 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span className="border-b border-indigo-400 hover:border-indigo-300">View case study</span>
                <IconArrowRight />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Projects Section Component (Rebuilt without Motion) ---
const Projects = () => (
  <section id="projects" className="p-8 md:p-16 bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-extrabold pb-2 mb-12 border-b-4 border-indigo-500/50 inline-block">
        In-Depth Case Studies
      </h2>
      <div className="project-detail-list grid gap-16">
        {newProjectsData.map((project, index) => (
          <div
            key={index}
            className="project-detail border-b border-white/10 pb-12 transition-transform duration-500 ease-out hover:translate-x-1"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <span className="category text-sm font-semibold text-indigo-400 uppercase tracking-wider">{`0${index + 1}`} / {project.category}</span>
            <h3 className="text-3xl mt-1 mb-3 font-bold">{project.title}</h3>
            <div className="max-w-4xl text-white/70 mb-5 text-lg leading-relaxed">
              {project.descLong}
            </div>
            <a href="#" className="inline-flex items-center gap-2 py-2 text-lg font-semibold border-b-2 border-indigo-500 text-indigo-400 hover:text-indigo-300 transition-colors">
              View Full Case Study
              <IconArrowRight />
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);


// --- Main App Setup ---
export default function App() {
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Firebase Initialization and Auth Logic
  useEffect(() => {
    // Check if variables are defined globally
    if (typeof __firebase_config === 'undefined' || typeof __app_id === 'undefined') {
      console.error("Firebase global variables are missing.");
      setUserId("DEMO-USER-12345");
      setIsAuthReady(true);
      return;
    }

    const firebaseConfig = JSON.parse(__firebase_config);
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    try {
      const app = initializeApp(firebaseConfig, appId);
      const auth = getAuth(app);
      // const db = getFirestore(app); // Initialized but not explicitly used in this component

      const authenticate = async () => {
        try {
          if (typeof __initial_auth_token !== 'undefined') {
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
          setUserId(auth.currentUser?.uid || crypto.randomUUID());
        } catch (error) {
          console.error("Firebase Auth Error:", error);
          setUserId(crypto.randomUUID());
        } finally {
          setIsAuthReady(true);
        }
      };

      authenticate();
    } catch (e) {
      console.error("Firebase Initialization Failed:", e);
      setUserId("INIT-ERROR");
      setIsAuthReady(true);
    }
  }, []);

  return (
    <div className="min-h-screen font-sans bg-gray-900">
      <Work />
      <Projects />
      
      {/* Footer for User ID and context */}
      <div className="p-8 text-center text-white/30 text-xs">
          <p>Note: External libraries like 'Tilt' and 'framer-motion' were replaced with standard React and Tailwind CSS for compatibility.</p>
          <p className="mt-2">Current User ID: {userId || "Authenticating..."}</p>
      </div>
    </div>
  );
}



// --- Skills Section (UPDATED with Logo Belt) ---
const Skills = () => {
    const skillCards = [
        { title: 'Data Structures & Algorithms', list: ['LeetCode', 'HackerRank', 'Codeforces', 'Competitive Programming'] },
        { title: 'Frontend Development', list: ['HTML5 & CSS3 (Advanced)', 'JavaScript (ES6+)', 'React & Next.js', 'Responsive Architecture'] },
        { title: 'Backend & Data', list: ['Node.js / Python', 'Cloud Functions (Firebase)', 'Database Architecture', 'API Development (REST/GraphQL)'] },
    ];

     const skillLogos = [
        { name: 'HTML5', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'CSS3', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
        { name: 'JavaScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'React', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Node.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'Python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'C', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
        { name: 'C++', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
        { name: 'Java', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'MongoDB', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' }, // Represents NoSQL
        { name: 'Git', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    ];

    // CSS for the earth-rotation and tooltip
    const logoAnimationStyles = `
    @keyframes spinY {
      from { transform: rotateY(0deg); }
      to   { transform: rotateY(360deg); }
    }
    .logo-item-wrapper {
      perspective: 1000px;
    }
    .logo-spinner {
      animation: spinY 20s linear infinite;
      transform-style: preserve-3d;
      position: relative;
    }
    .logo-item-wrapper:hover .logo-spinner {
      animation-play-state: paused;
    }
    .tooltip-text {
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.2s, transform 0.2s;
      transform: translateY(10px);
    }
    .logo-item-wrapper:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  `;

    return (
        <section id="skills" className="px-xl pt-[15vh] pb-[10vh]">
            <style>{logoAnimationStyles}</style>

            <h2 className="text-section-title section-title pb-5 mb-10 max-md:text-4xl">
                Expertise & Capabilities
            </h2>

            {/* Skill Cards */}
            <div className="skills-grid grid grid-cols-1 md:grid-cols-3 gap-10">
                {skillCards.map((skill, index) => (
                    <Tilt
                        key={skill.title}
                        glareEnable={true}
                        glareMaxOpacity={0.1}
                        scale={1.03}
                        tiltMaxAngleX={8}
                        tiltMaxAngleY={8}
                        transitionSpeed={1500}
                    >
                        <motion.div
                            className="skill-category p-8 border border-white/15 rounded-lg bg-white/4 h-full"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <h3 className="text-2xl text-accent mb-4">{skill.title}</h3>
                            <ul className="list-none">
                                {skill.list.map((item, i) => (
                                    <li key={i} className="text-white/70 mb-2">{item}</li>
                                ))}
                            </ul>
                        </motion.div>
                    </Tilt>
                ))}
            </div>

            {/* Logo Belt */}
            <div className="mt-20">
                <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-12">
                    {skillLogos.map(({ name, url }) => (
                        <div key={name} className="logo-item-wrapper flex flex-col items-center gap-2 group">
                            <div className="logo-spinner w-16 h-16">
                                <img src={url} alt={`${name} logo`} className="w-full h-full object-contain" />
                            </div>
                            <p className="tooltip-text text-sm text-white/70 font-medium">
                                {name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
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


// --- About Section (Unchanged) ---
const About = () => (
    <section id="about" className="px-xl pt-[15vh] pb-[10vh]">
        {/* The main wrapper already has a fade-in animation, so we'll keep that */}
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
        >
            <h2 id="about-title" className="text-section-title section-title pb-5 mb-10 max-md:text-4xl">About Me</h2>
            
            <div className="about-wrap grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10">
                
                {/* Animation for the left (main copy) column */}
                <motion.div
                    className="about-copy"
                    initial={{ opacity: 0, x: -50 }} // Slide in from left
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <p className="text-white/75 mb-4 max-w-2xl text-lg font-light">
                        I am an Aspiring Software Engineer with a passion for building reliable and efficient software solutions. 
                        I possess strong foundational skills in both software development and backend engineering.
                    </p>
                    
                    <p className="text-white/75 mb-4 max-w-2xl text-lg font-light">
                        I thrive on team collaboration and have experience applying project management concepts. I am constantly eager to contribute to impactful projects while continuously learning and growing in the tech industry.
                    </p>
                    
                    {/* The stat cards should also inherit the motion.div animation */}
                    <div className="stat-cards grid grid-cols-3 gap-3 mt-8 max-w-xl">
                        {/* ... Stat Card 1 ... */}
                        <div className="stat-card text-center p-4 border border-white/10 rounded-lg bg-white/5">
                            <div className="num text-3xl font-bold text-accent">3+</div>
                            <div className="label text-sm text-white/70">Major Projects</div>
                        </div>
                        {/* ... Stat Card 2 ... */}
                        <div className="stat-card text-center p-4 border border-white/10 rounded-lg bg-white/5">
                            <div className="num text-3xl font-bold text-accent">2+</div>
                            <div className="label text-sm text-white/70">Hackathon Attendee</div>
                        </div>
                        {/* ... Stat Card 3 ... */}
                        <div className="stat-card text-center p-4 border border-white/10 rounded-lg bg-white/5">
                            <div className="num text-3xl font-bold text-accent">GATE</div>
                            <div className="label text-sm text-white/70">Exam Aspirant</div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Animation for the right (Focus Areas) column */}
                <Tilt
                    glareEnable={true}
                    glareMaxOpacity={0.1}
                    scale={1.03}
                    tiltMaxAngleX={8}
                    tiltMaxAngleY={8}
                    transitionSpeed={1500}
                >
                    <motion.aside
                        className="about-aside border border-white/15 rounded-lg p-6 bg-white/4 h-full"
                        aria-label="Key Focus Areas"
                        initial={{ opacity: 0, x: 50 }} // Slide in from right
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h3 className="accent-text mb-3 text-xl font-semibold">Key Focus Areas</h3>
                        <p className="text-white/75 mb-4">
                            My current learning and project development is centered on high-impact technologies and computer science fundamentals.
                        </p>
                        <ul className="list-none text-white/75 space-y-2">
                            <li>• Data Structures and Algorithms (DSA)</li>
                            <li>• Preparation for GATE Exam</li>
                            <li>• Machine Learning & AI Algorithms</li> 
                            <li>• Python Backend Development (using Flask API)</li> 
                            <li>• Backend System Design & APIs</li>
                            <li>• Full-Stack Project Implementation</li>
                        </ul>
                    </motion.aside>
                </Tilt>
            </div>
        </motion.div>

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


// --- Contact Section (Unchanged) ---
const Contact = () => {
    const socialLinks = [
        { href: 'https://linkedin.com/in/yourprofile', Icon: icons.LinkedIn, title: 'LinkedIn' },
        { href: 'https://github.com/your-username', Icon: icons.GitHub, title: 'GitHub' },
        { href: 'https://twitter.com/yourhandle', Icon: icons.X, title: 'X (Twitter)' },
    ];

    return (
        <section id="contact" className="px-xl pt-[5vh] pb-[5vh]">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.0 }}
            >
                <h2 id="contact-title" className="text-6xl section-title pb-5 mb-8 max-w-3xl max-md:text-4xl">Ready to build something great?</h2>

                <div className="social-links flex mt-8">
                    {socialLinks.map(({ href, Icon, title }, index) => (
                        <motion.a
                            key={title}
                            href={href}
                            target="_blank"
                            title={title}
                            rel="noopener"
                            className="mr-6 text-white/50 transition-all hover:text-accent"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        >
                            <Icon className="w-8 h-8" />
                        </motion.a>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export { Work, Projects, Skills, About, Contact };
