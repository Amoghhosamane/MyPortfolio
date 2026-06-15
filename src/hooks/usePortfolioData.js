import { useState, useEffect } from 'react';

// Default fallback experience data (used if API is offline)
const FALLBACK_DATA = {
  experiences: [
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
      order: 0,
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
};

const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://myportfolio-s7td.onrender.com';

export function usePortfolioData() {
  const [data, setData] = useState(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE}/api/portfolio`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) {
          // Merge: prefer API data, but fall back to defaults for missing keys
          setData({ ...FALLBACK_DATA, ...json });
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          console.warn('Portfolio API unavailable, using fallback data.', e.message);
          setError(e.message);
          // Keep fallback data
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}

export { API_BASE };
