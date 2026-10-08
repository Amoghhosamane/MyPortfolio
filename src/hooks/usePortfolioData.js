import { useState, useEffect, useCallback } from 'react';

// Default fallback experience data (used if API is offline)
const FALLBACK_DATA = {
  experiences: [
    {
      id: 'exp-0',
      org: 'Breakthrough Medical Solutions',
      role: 'Full Stack Developer Intern / Consultant',
      duration: 'Present',
      location: 'London · Hybrid',
      bullets: [
        'Built an AI-powered clinical simulation platform for UK medical universities using Next.js, TypeScript, FastAPI, Python, Supabase & LLMs.',
        'Developed real-time collaborative clinical sessions using WebSockets, enabling educator-led and multi-student simulations.',
        'Engineered LLM-powered patient interactions with case-aware reasoning, progressive disclosure and structured clinical data.',
        'Built scalable case-authoring and analytics workflows covering history, examination, investigations, diagnosis and management.',
      ],
      tags: ['Next.js', 'TypeScript', 'FastAPI', 'Python', 'Supabase', 'LLMs', 'WebSockets'],
      color: 'border-cyan-400',
      visible: true,
      order: 0,
    },
    {
      id: 'exp-galway',
      org: 'University of Galway',
      role: 'Research Intern',
      duration: 'Apr 2025 – Present',
      location: 'Galway, Ireland · Remote',
      bullets: [
        'Researching and studying Multi-Agent AI Systems under Prof. Saeed Alshami.',
        'Working on multi-agent AI research with the goal of developing and evaluating a research contribution suitable for submission to top-tier AI/ML conferences.',
      ],
      tags: ['Multi-Agent AI', 'AI Systems', 'LLMs', 'Research', 'Python', 'Machine Learning'],
      color: 'border-emerald-400',
      visible: true,
      order: 1,
    },
    {
      id: 'exp-1',
      org: 'National University of Singapore (NUS)',
      role: 'Summer Research Intern',
      duration: 'Apr 2026 – Present',
      location: 'Singapore · Remote',
      bullets: [
        'Researching Transformer architectures and LLMs',
        'Contributing to an AI-powered LMS project',
        'Building intelligent academic assistants',
        'Optimizing backend systems and APIs',
        'Exploring scalable AI system design',
      ],
      tags: ['Next.js', 'Flask', 'LLMs', 'Transformers', 'Python', 'AI Automation'],
      color: 'border-blue-400',
      visible: true,
      order: 2,
    },
    {
      id: 'exp-2',
      org: 'Insight Research Ireland Centre for Data Analytics',
      role: 'AI Research Intern',
      duration: 'May 2026 – Present',
      location: 'Galway, Ireland · Remote',
      bullets: [
        'Working on AI research initiatives and data-driven systems',
        'Contributing to research-oriented development workflows',
        'Exploring scalable AI applications and practical implementation',
      ],
      tags: ['AI Research', 'Python', 'Machine Learning', 'Data Analytics', 'Docker', 'Kubernetes', 'PostgreSQL'],
      color: 'border-emerald-400',
      visible: true,
      order: 1,
    },
    {
      id: 'exp-3',
      org: 'Australian National University (ANU)',
      role: 'Volunteer Software Engineer',
      duration: 'Feb 2026 – Present',
      location: 'Canberra, Australia · Remote',
      bullets: [
        'Developing decentralized applications using Solid standards',
        'Working with WebID authentication and Pod-based storage',
        'Improving responsiveness and frontend performance',
        'Contributing to scalable AI system exploration',
      ],
      tags: ['Flutter', 'Dart', 'Python', 'C++', 'Solid Pods', 'WebID'],
      color: 'border-yellow-400',
      visible: true,
      order: 2,
    },
    {
      id: 'exp-4',
      org: 'Open Source Connect (OSCG)',
      role: 'Mentor & Contributor',
      duration: 'Jan 2026 – Feb 2026',
      location: '',
      bullets: [
        'Mentored students in Python and AI projects',
        'Guided collaborative development workflows',
        'Helped with open-source software engineering',
      ],
      tags: ['Python', 'AI', 'Mentorship', 'Open Source'],
      color: 'border-purple-400',
      visible: true,
      order: 3,
    },
  ],
  projects: [],
  skills: [],
  certifications: [],
  about: {},
  resume: {},
  research: [],
};

const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://myportfolio-s7td.onrender.com';

const CACHE_KEY = 'portfolio_data_cache';

// Helper to get initial data from local cache or fallback
function getInitialData() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...FALLBACK_DATA, ...parsed };
    }
  } catch (_) {}
  return FALLBACK_DATA;
}

export function usePortfolioData() {
  const [data, setData] = useState(getInitialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFreshData = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(`${API_BASE}/api/portfolio?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const merged = { ...FALLBACK_DATA, ...json };
      setData(merged);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
      } catch (_) {}
      setError(null);
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError(e.message);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Initial background fetch on mount
    fetchFreshData();

    // 2. Fetch on window focus (so data is always live when user switches tabs)
    const onFocus = () => fetchFreshData();
    window.addEventListener('focus', onFocus);

    // 3. Listen to live updates from Admin Panel
    const onDataUpdated = (event) => {
      if (event.detail) {
        const merged = { ...FALLBACK_DATA, ...event.detail };
        setData(merged);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
        } catch (_) {}
      }
    };
    window.addEventListener('portfolio-data-updated', onDataUpdated);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('portfolio-data-updated', onDataUpdated);
    };
  }, [fetchFreshData]);

  return { data, loading, error, refetch: fetchFreshData };
}

export { API_BASE };
