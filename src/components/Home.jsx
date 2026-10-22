// Filename: src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import myFaceImage from '../assets/my-face.png';
import AnimatedSection from './AnimatedSection';
import Experience from './Experience';
import breakthroughImg from '../assets/breakthrough-med.png';
import skillorbitImg from '../assets/skillorbit.png';
import { FaGithub, FaArrowLeft, FaArrowRight, FaArrowUp } from 'react-icons/fa';
import { HiArrowUpRight } from 'react-icons/hi2';

// Custom styles for the dark editorial background
const customHomeStyles = `
  #home::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 45% at 50% 35%, rgba(14, 42, 90, 0.18), transparent 75%), #07090E;
    z-index: -1;
  }
`;

// Real-world projects dataset matching the user's visual reference:
// - Left: Large realistic deployed product interface inside a subtle browser frame
// - Right: Category in teal/cyan, large title, short description, 3 bullet points with teal dots,
//          TECH STACK label + plain text technologies, and two links: "View live product ↗" and "GitHub ↗"
const FEATURED_PROJECTS = [
  {
    id: 'casebase',
    category: 'HEALTHCARE AI',
    title: 'Breakthrough Medical Solutions',
    subtitle: 'An AI-powered clinical simulation platform for university medical training.',
    domain: 'breakthrough-med.com',
    liveUrl: 'https://breakthrough-med.com/',
    repoUrl: 'https://github.com/Amoghhosamane',
    hasLiveProduct: true,
    image: breakthroughImg,
    highlights: [
      'Case-aware AI patients with progressive clinical disclosures',
      'Real-time simulation rooms built with WebSockets',
      'Next.js, FastAPI, TypeScript, Supabase'
    ],
    techStack: ['Next.js', 'TypeScript', 'FastAPI', 'Python', 'Supabase', 'WebSockets', 'HTML'],
    previewType: 'screenshot'
  },
  {
    id: 'skillorbit',
    category: 'FULL-STACK PLATFORM',
    title: 'Skill Orbit Learning System',
    subtitle: 'A full-stack learning platform with structured courses and user analytics.',
    domain: 'skillorbitlearn.vercel.app/dashboard',
    liveUrl: 'https://skillorbitlearn.vercel.app/',
    repoUrl: 'https://github.com/Amoghhosamane/learning',
    hasLiveProduct: true,
    image: skillorbitImg,
    highlights: [
      'Next.js App Router architecture with serverless API functions',
      'User authentication and role-based sessions powered by NextAuth',
      'Centralized MongoDB Atlas integration with real-time course tracking'
    ],
    techStack: ['Next.js', 'TypeScript', 'MongoDB Atlas', 'NextAuth', 'TailwindCSS', 'Vercel'],
    previewType: 'screenshot'
  },
  {
    id: 'fnol-orchestrator',
    category: 'DEVELOPER TOOLING / AI',
    title: 'AI Agent Orchestration Platform',
    subtitle: 'Autonomous insurance claims orchestration with multi-agent consensus.',
    domain: 'fnol-orchestrator.internal',
    liveUrl: null,
    repoUrl: 'https://github.com/Amoghhosamane',
    hasLiveProduct: false,
    highlights: [
      'Centralized orchestrator managing distributed sub-agent validation workflows',
      'Automated damage severity estimation with duplicate claim fraud detection',
      'First Place solution at Microsoft Copilot Developer Camp Pune Ideathon'
    ],
    techStack: ['Python', 'Multi-Agent AI', 'Copilot Studio', 'FastAPI', 'Docker'],
    previewType: 'ai-orchestrator'
  },
  {
    id: 'rag-engine',
    category: 'ENTERPRISE AI',
    title: 'Contextual RAG Retrieval Engine',
    subtitle: 'Vector-augmented retrieval system enabling grounded Q&A over private archives.',
    domain: 'rag-engine.internal',
    liveUrl: null,
    repoUrl: 'https://github.com/Amoghhosamane/IMF_RAG',
    hasLiveProduct: false,
    highlights: [
      'Document chunking with dense vector embeddings stored in ChromaDB',
      'Strict contextual prompt injection eliminating LLM hallucinations',
      'Sub-second semantic search retrieval across thousands of technical records'
    ],
    techStack: ['LangChain', 'ChromaDB', 'Python', 'OpenAI API', 'FastAPI'],
    previewType: 'rag-engine'
  },
  {
    id: 'heart-predict',
    category: 'HEALTHCARE ML',
    title: 'Clinical Diagnostic Prediction Engine',
    subtitle: 'Predictive diagnostic models evaluating risk across 11 cardiovascular indicators.',
    domain: 'heart-predict.streamlit.app',
    liveUrl: null,
    repoUrl: 'https://github.com/Amoghhosamane/HeartDisease',
    hasLiveProduct: false,
    highlights: [
      'Benchmarked Random Forest, Logistic Regression, and SVM architectures',
      'Achieved up to 90% test accuracy with calibrated risk stratification',
      'Interactive clinical diagnostic dashboard with bulk batch processing'
    ],
    techStack: ['Python', 'scikit-learn', 'Streamlit', 'Plotly', 'Pandas'],
    previewType: 'heart-disease'
  }
];

// Realistic Browser Frame + Deployed Product Interface Simulation
// Matches the exact visual from the user reference: subtle dark browser window, 3 window dots, domain pill,
// realistic app screens (CaseBase simulation UI, SkillOrbit dashboard, etc.)
const RealisticProductBrowser = ({ project }) => {
  return (
    <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#0B0F17] border border-[#1E293B] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-300">
      {/* Browser Chrome Header */}
      <div className="h-10 px-4 bg-[#0E1522] border-b border-[#1E293B] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80 inline-block"></span>
          </div>
          {/* Navigation arrows */}
          <div className="flex items-center gap-1 ml-2 text-[#475569] text-xs">
            <span>&lt;</span>
            <span>&gt;</span>
          </div>
        </div>

        {/* URL Pill */}
        <div className="flex items-center justify-center px-4 py-1 rounded-md bg-[#070A10] border border-[#1E293B] text-[11px] font-mono text-[#94A3B8] max-w-[220px] sm:max-w-[280px] truncate">
          <span className="text-[#38BDF8] mr-1.5">https://</span>
          {project.domain}
        </div>

        <div className="w-8 flex justify-end text-[#475569] text-xs">
          <span>•••</span>
        </div>
      </div>

      {/* Screen Body with Realistic Product UI */}
      <div className="p-0 bg-[#090D15] text-[#CBD5E1] font-sans text-xs min-h-[300px] sm:min-h-[340px] flex flex-col justify-between overflow-hidden">
        {project.previewType === 'screenshot' && project.image ? (
          <div className="relative w-full h-full min-h-[300px] sm:min-h-[340px] bg-[#070A10] flex items-center justify-center overflow-hidden group/img">
            <img
              src={project.image}
              alt={`${project.title} live interface`}
              className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover/img:scale-[1.02]"
              loading="lazy"
            />
            {/* Subtle dark border overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#090D15]/80 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="p-4 sm:p-5 h-full flex flex-col justify-between">
            {project.previewType === 'medical-sim' && (
          /* Exact CaseBase Clinical Simulation Screen from Reference Image */
          <div className="space-y-3.5">
            {/* App Nav */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#2563EB] flex items-center justify-center text-white text-[10px] font-bold">
                    C
                  </div>
                  <span className="text-white font-bold text-sm tracking-tight">CaseBase</span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#64748B]">
                  <span className="hover:text-white cursor-pointer">Patients</span>
                  <span className="text-[#38BDF8] font-medium cursor-pointer">Cases</span>
                  <span className="hover:text-white cursor-pointer">Simulation</span>
                  <span className="hover:text-white cursor-pointer">Library</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                <div className="w-5 h-5 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[9px] text-[#38BDF8] font-bold">
                  AH
                </div>
                <span className="hidden sm:inline">Amogh Hosamane</span>
              </div>
            </div>

            {/* Sub-header */}
            <div className="flex items-center justify-between text-[11px]">
              <div>
                <span className="text-[#64748B] hover:text-white cursor-pointer">← Back to cases</span>
                <h4 className="text-white font-bold text-base mt-1">Patient Case: Acute Chest Pain</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1E3A8A]/50 text-[#60A5FA] border border-[#2563EB]/40">
                    Cardiology
                  </span>
                  <span className="text-[#64748B] text-[10px]">• Male, 58 years</span>
                  <span className="text-[#64748B] text-[10px]">• Stage 3/8</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#10B981] font-semibold">● Stable</span>
                <div className="text-[10px] text-[#64748B] mt-0.5">HR 92 bpm · BP 138/86</div>
              </div>
            </div>

            {/* Two Sub-columns inside Clinical App: Left Patient Interaction & Right Vitals/Data */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              {/* Dialogue Panel */}
              <div className="sm:col-span-8 p-3 rounded-lg bg-[#0E1522] border border-[#1E293B] space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#1E293B] border border-[#38BDF8]/40 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    P
                  </div>
                  <div className="flex-1 bg-[#151E2E] p-2.5 rounded-lg border border-[#1E293B] text-[11px] text-[#E2E8F0] leading-relaxed">
                    "I've been having this tightness right across my chest for about 2 hours now. It started while I was walking to the office."
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pl-4">
                  <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    Dr
                  </div>
                  <div className="flex-1 bg-[#0A101D] p-2.5 rounded-lg border border-[#2563EB]/30 text-[11px] text-[#93C5FD] leading-relaxed">
                    "Can you describe if the pain radiates to your left arm or jaw, and do you feel shortness of breath?"
                  </div>
                </div>
              </div>

              {/* Vitals & Telemetry */}
              <div className="sm:col-span-4 p-3 rounded-lg bg-[#0E1522] border border-[#1E293B] flex flex-col justify-between space-y-2">
                <div className="space-y-1.5 text-[10px]">
                  <div className="text-[#64748B] uppercase tracking-wider font-semibold text-[9px]">Live Telemetry</div>
                  <div className="flex justify-between text-[#CBD5E1]">
                    <span>SpO₂</span>
                    <span className="text-[#38BDF8] font-mono">98%</span>
                  </div>
                  <div className="flex justify-between text-[#CBD5E1]">
                    <span>RR</span>
                    <span className="text-[#38BDF8] font-mono">18 /min</span>
                  </div>
                  <div className="flex justify-between text-[#CBD5E1]">
                    <span>Temp</span>
                    <span className="text-[#38BDF8] font-mono">36.8 °C</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#1E293B] text-[10px] flex items-center justify-between text-[#38BDF8]">
                  <span>ECG 12-Lead</span>
                  <span className="text-[9px] uppercase font-bold text-[#10B981]">View Wave</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {project.previewType === 'skillorbit' && (
          /* Skill Orbit Learning Platform Screen */
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#0D9488] flex items-center justify-center text-white text-[10px] font-bold">
                  S
                </div>
                <span className="text-white font-bold text-sm tracking-tight">Skill Orbit</span>
              </div>
              <div className="text-[11px] text-[#64748B] flex items-center gap-3">
                <span className="text-[#2DD4BF] font-medium">Dashboard</span>
                <span className="hover:text-white cursor-pointer">Curriculum</span>
                <span className="hover:text-white cursor-pointer">Live Labs</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-lg bg-[#0E1522] border border-[#1E293B]">
                <div className="text-[#64748B] text-[10px]">Active Track</div>
                <div className="text-white font-bold text-sm mt-0.5">Distributed Systems</div>
                <div className="w-full bg-[#1E293B] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#2DD4BF] h-full w-[72%] rounded-full"></div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#0E1522] border border-[#1E293B]">
                <div className="text-[#64748B] text-[10px]">Completed Modules</div>
                <div className="text-white font-bold text-sm mt-0.5">14 of 18 Units</div>
                <div className="text-[#10B981] text-[10px] mt-1 font-mono">● 78% mastery</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0E1522] border border-[#1E293B]">
                <div className="text-[#64748B] text-[10px]">Production DB</div>
                <div className="text-white font-bold text-sm mt-0.5">MongoDB Atlas</div>
                <div className="text-[#38BDF8] text-[10px] mt-1 font-mono">cluster-0: connected</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0E1522] border border-[#1E293B] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-white font-semibold text-xs">Current Lecture: Asynchronous Consensus & Raft</div>
                <div className="text-[#64748B] text-[10px]">Full-Stack Next.js 14 App Router Video Stream</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#0D9488]/30 text-[#2DD4BF] border border-[#0D9488]/50 text-[10px] font-bold">
                Resume Lecture
              </span>
            </div>
          </div>
        )}

        {project.previewType === 'ai-orchestrator' && (
          /* Multi-Agent Orchestration Platform Console */
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#3B82F6] flex items-center justify-center text-white text-[10px] font-bold">
                  ⚡
                </div>
                <span className="text-white font-bold text-sm tracking-tight">FNOL Swarm Orchestrator</span>
              </div>
              <span className="text-[10px] font-mono text-[#38BDF8] bg-[#1E293B] px-2 py-0.5 rounded">
                Active Agents: 5
              </span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-[#0E1522] border border-[#1E293B] flex items-center justify-between">
                <span className="text-[#94A3B8]">[Claim-Router] Policy verified #POL-89412</span>
                <span className="text-[#10B981] font-bold">MATCH 100%</span>
              </div>
              <div className="p-2.5 rounded bg-[#0E1522] border border-[#1E293B] flex items-center justify-between">
                <span className="text-[#94A3B8]">[Severity-Agent] Computer vision vehicle damage assess</span>
                <span className="text-[#38BDF8] font-bold">GRADE: MODERATE</span>
              </div>
              <div className="p-2.5 rounded bg-[#0E1522] border border-[#1E293B] flex items-center justify-between">
                <span className="text-[#94A3B8]">[Fraud-Detection] Vector similarity check on duplicate FNOL</span>
                <span className="text-[#10B981] font-bold">0 DUPLICATES</span>
              </div>
            </div>

            <div className="text-[10px] text-[#64748B] flex items-center justify-between pt-1">
              <span>Microsoft Copilot Studio • Award Winner Pune Ideathon</span>
              <span className="text-white font-mono">Latency: 1.2s total</span>
            </div>
          </div>
        )}

        {project.previewType === 'rag-engine' && (
          /* RAG Vector Querying Terminal */
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#0284C7] flex items-center justify-center text-white text-[10px] font-bold">
                  ☵
                </div>
                <span className="text-white font-bold text-sm tracking-tight">Enterprise ChromaDB RAG</span>
              </div>
              <span className="text-[10px] font-mono text-[#38BDF8]">Vector Index: Online</span>
            </div>

            <div className="p-3 rounded-lg bg-[#0E1522] border border-[#1E293B] space-y-2 text-[11px]">
              <div className="text-[#64748B] text-[10px]">User Semantic Query:</div>
              <div className="text-white font-mono bg-[#070A10] p-2 rounded border border-[#1E293B]">
                "What are the protocol guidelines for multi-tenant token rate limiting?"
              </div>
              <div className="text-[#64748B] text-[10px] pt-1">Retrieved Chunks (Top-k: 3, Cosine: 0.94):</div>
              <div className="text-[#93C5FD] font-mono text-[10px] pl-2 border-l-2 border-[#38BDF8]">
                Matched section 4.2 in architecture_policy.pdf — hallucination risk: 0.0%
              </div>
            </div>
          </div>
        )}

        {project.previewType === 'heart-disease' && (
          /* Heart Disease Diagnostics Screen */
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#E11D48] flex items-center justify-center text-white text-[10px] font-bold">
                  ♥
                </div>
                <span className="text-white font-bold text-sm tracking-tight">CardioRisk ML Predictor</span>
              </div>
              <span className="text-[10px] font-mono text-[#10B981]">ROC-AUC: 0.91</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2.5 rounded bg-[#0E1522] border border-[#1E293B]">
                <div className="text-[#64748B]">Clinical Model</div>
                <div className="text-white font-bold mt-0.5">Logistic Regression</div>
                <div className="text-[#38BDF8] font-mono mt-1">90.2% test precision</div>
              </div>
              <div className="p-2.5 rounded bg-[#0E1522] border border-[#1E293B]">
                <div className="text-[#64748B]">Inference Mode</div>
                <div className="text-white font-bold mt-0.5">Real-time Streamlit</div>
                <div className="text-[#10B981] font-mono mt-1">Plotly chart rendering</div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#0E1522] border border-[#1E293B] text-[10px] flex items-center justify-between font-mono">
              <span className="text-[#94A3B8]">11 Clinical Attributes: BP, Chol, FastingBS, MaxHR, Oldpeak</span>
              <span className="text-[#38BDF8]">Ready</span>
            </div>
          </div>
        )}
          </div>
        )}
      </div>
    </div>
  );
};

// Component: Featured Projects section matching the exact visual reference
const ProjectsBuiltForRealWorld = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(FEATURED_PROJECTS.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = FEATURED_PROJECTS.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Format page string as "01 / 03"
  const formattedPage = `0${currentPage} / 0${totalPages}`;

  return (
    <section id="top-projects" className="scroll-mt-24 py-16 text-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header matching visual reference:
            - Small uppercase "SELECTED WORK" eyebrow in teal
            - Large bold title: "Projects built for real-world use"
            - Subtitle: "Production-minded systems across AI, healthcare, and developer tooling."
            - Top-right pagination: [←] 01 / 03 [→]
        */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-[12px] font-bold tracking-widest text-[#2DD4BF] uppercase mb-3 font-mono">
              SELECTED WORK
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Projects built for real-world use
            </h2>
            <p className="text-[#94A3B8] text-sm sm:text-base mt-3 max-w-2xl font-light">
              Production-minded systems across AI, healthcare, and developer tooling.
            </p>
          </div>

          {/* Top-Right Pagination Controls: ← 01 / 03 → */}
          <div className="flex items-center gap-4 self-start md:self-end">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              aria-label="Previous project page"
              className={`p-2 transition-colors duration-200 ${
                currentPage === 1
                  ? 'text-[#334155] cursor-not-allowed'
                  : 'text-[#94A3B8] hover:text-white cursor-pointer active:scale-95'
              }`}
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-xs sm:text-sm text-white/90 font-medium tracking-wider">
              {formattedPage}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              aria-label="Next project page"
              className={`p-2 transition-colors duration-200 ${
                currentPage === totalPages
                  ? 'text-[#334155] cursor-not-allowed'
                  : 'text-[#94A3B8] hover:text-white cursor-pointer active:scale-95'
              }`}
            >
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Large Two-Column Featured Project Cards with Clean Minimal Dark Style */}
        <div className="space-y-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-12"
            >
              {currentProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 bg-[#090D14]/90 border border-[#1E293B] shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#334155]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* LEFT COLUMN: Large Realistic Browser Product Screenshot (7 cols) */}
                    <div className="lg:col-span-7 w-full">
                      <RealisticProductBrowser project={project} />
                    </div>

                    {/* RIGHT COLUMN: Project Details, Highlights, Tech Stack, Links (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                      <div>
                        {/* Category eyebrow in teal */}
                        <div className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-[#2DD4BF] uppercase mb-2">
                          {project.category}
                        </div>

                        {/* Large Title */}
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                          {project.title}
                        </h3>

                        {/* Short Description */}
                        <p className="text-sm sm:text-base text-[#94A3B8] mt-2 mb-6 font-light leading-relaxed">
                          {project.subtitle}
                        </p>

                        {/* 3 Concise Feature Highlights with Teal Dot Indicator */}
                        <ul className="space-y-3.5">
                          {project.highlights.map((highlight, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                              <span className="mt-1.5 w-2 h-2 rounded-full bg-[#2DD4BF] shrink-0" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Divider */}
                      <div className="pt-6 border-t border-[#1E293B]">
                        {/* Plain Text Technology Stack */}
                        <div className="mb-6">
                          <div className="text-[10px] font-mono uppercase tracking-widest text-[#64748B] mb-2 font-semibold">
                            TECH STACK
                          </div>
                          <div className="text-xs text-[#CBD5E1] font-mono leading-relaxed">
                            {project.techStack.join('   ')}
                          </div>
                        </div>

                        {/* Two Clear Minimal Links matching Reference Image */}
                        <div className="flex flex-wrap items-center gap-3">
                          {project.liveUrl ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#07090E] font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-sm"
                            >
                              <span>View live product</span>
                              <HiArrowUpRight className="w-4 h-4 stroke-2" />
                            </a>
                          ) : (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#07090E] font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-sm"
                            >
                              <span>View repository</span>
                              <HiArrowUpRight className="w-4 h-4 stroke-2" />
                            </a>
                          )}

                          {project.repoUrl && (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0E1522] hover:bg-[#151E2E] text-white font-medium text-xs sm:text-sm border border-[#1E293B] hover:border-[#334155] transition-all duration-200 active:scale-95"
                            >
                              <FaGithub className="w-3.5 h-3.5" />
                              <span>GitHub</span>
                              <HiArrowUpRight className="w-3.5 h-3.5 text-[#64748B]" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsShowing(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section px-xl pt-[12vh] lg:pt-[15vh] pb-[10vh] relative" id="home">
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
              I'm <span className="accent-text font-bold">Amogh Hosamane</span>,{' '}
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
            <p className="text-[1.1rem] sm:text-[1.2rem] md:text-[1.25rem] text-white/70 max-w-2xl max-lg:max-w-full">
              A Software Architect passionate about designing scalable and efficient software systems. I build robust backend solutions and explore AI/ML concepts to create intelligent, high-performance applications. I thrive on collaborating with teams and turning innovative ideas into impactful projects, while continuously learning and evolving in the tech world.
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

      {/* Experience Section */}
      <AnimatedSection>
        <Experience />
      </AnimatedSection>

      {/* Projects Built For Real-World Use (Linear / Vercel dark minimal editorial showcase) */}
      <ProjectsBuiltForRealWorld />

      {/* Certificates section */}
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

export default Home;