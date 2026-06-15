import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://myportfolio-s7td.onrender.com';

// ─── Small UI helpers ────────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const Badge = ({ children, color = 'teal' }) => {
  const cls = {
    teal: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  }[color] || 'bg-white/10 text-white/60 border-white/10';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cls}`}>
      {children}
    </span>
  );
};

const Toast = ({ msg, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 40 }}
    className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium backdrop-blur-sm
      ${type === 'error'
        ? 'bg-red-900/80 border-red-500/40 text-red-200'
        : 'bg-emerald-900/80 border-emerald-500/40 text-emerald-200'
      }`}
  >
    <span>{type === 'error' ? '✕' : '✓'}</span>
    <span>{msg}</span>
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">✕</button>
  </motion.div>
);

// Color options for experience cards
const COLOR_OPTIONS = [
  { label: 'Blue', value: 'border-blue-400' },
  { label: 'Emerald', value: 'border-emerald-400' },
  { label: 'Yellow', value: 'border-yellow-400' },
  { label: 'Purple', value: 'border-purple-400' },
  { label: 'Teal', value: 'border-teal-400' },
  { label: 'Pink', value: 'border-pink-400' },
  { label: 'Red', value: 'border-red-400' },
  { label: 'Cyan', value: 'border-cyan-400' },
  { label: 'Orange', value: 'border-orange-400' },
];

const SIDEBAR_ITEMS = [
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'skills', label: 'Skills', icon: '🧠' },
  { id: 'certifications', label: 'Certifications', icon: '🏅' },
  { id: 'about', label: 'About', icon: '👤' },
  { id: 'resume', label: 'Resume', icon: '📄' },
  { id: 'research', label: 'Research', icon: '🔬' },
];

// ─── Login Screen ────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Login failed');
      onLogin(j.token);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-teal-500/10 border border-teal-500/20 rounded-full flex items-center justify-center text-2xl">
            🛡️
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/40 text-sm mt-1">Portfolio Content Manager</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Admin password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30
                       focus:outline-none focus:border-teal-500 transition-colors text-sm"
            autoFocus
          />
          {err && <p className="text-red-400 text-sm">{err}</p>}
          <button
            type="submit"
            disabled={loading || !pw}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold
                       transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading && <Spinner />}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Experience Editor ───────────────────────────────────────────────────────
const emptyExp = () => ({
  id: `exp-${Date.now()}`,
  org: '',
  role: '',
  duration: '',
  location: '',
  bullets: [''],
  tags: [],
  color: 'border-teal-400',
  visible: true,
  order: 0,
});

const ExperienceEditor = ({ data, onChange }) => {
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [form, setForm] = useState(emptyExp());
  const [tagInput, setTagInput] = useState('');
  const [dragging, setDragging] = useState(null);
  const experiences = data.experiences || [];

  const openNew = () => {
    const e = emptyExp();
    e.order = experiences.length;
    setForm(e);
    setTagInput('');
    setEditing('new');
  };

  const openEdit = (exp) => {
    setForm({ ...exp, bullets: [...(exp.bullets || [''])] });
    setTagInput('');
    setEditing(exp.id);
  };

  const cancelEdit = () => { setEditing(null); };

  const saveEdit = () => {
    const updated = editing === 'new'
      ? [...experiences, form]
      : experiences.map((e) => (e.id === editing ? form : e));
    onChange({ ...data, experiences: updated });
    setEditing(null);
  };

  const deleteExp = (id) => {
    onChange({ ...data, experiences: experiences.filter((e) => e.id !== id) });
  };

  const toggleVisible = (id) => {
    onChange({
      ...data,
      experiences: experiences.map((e) =>
        e.id === id ? { ...e, visible: !e.visible } : e
      ),
    });
  };

  // Drag-and-drop reorder
  const onDragStart = (e, idx) => { setDragging(idx); e.dataTransfer.effectAllowed = 'move'; };
  const onDragOver = (e, idx) => {
    e.preventDefault();
    if (dragging === null || dragging === idx) return;
    const reordered = [...experiences];
    const [moved] = reordered.splice(dragging, 1);
    reordered.splice(idx, 0, moved);
    onChange({ ...data, experiences: reordered.map((e, i) => ({ ...e, order: i })) });
    setDragging(idx);
  };
  const onDragEnd = () => setDragging(null);

  // Bullet helpers
  const setBullet = (i, val) => {
    const b = [...form.bullets];
    b[i] = val;
    setForm({ ...form, bullets: b });
  };
  const addBullet = () => setForm({ ...form, bullets: [...form.bullets, ''] });
  const removeBullet = (i) => setForm({ ...form, bullets: form.bullets.filter((_, j) => j !== i) });

  // Tag helpers
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
    }
    setTagInput('');
  };
  const removeTag = (t) => setForm({ ...form, tags: form.tags.filter((x) => x !== t) });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Experience</h2>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all active:scale-95"
        >
          + Add Experience
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            draggable
            onDragStart={(e) => onDragStart(e, idx)}
            onDragOver={(e) => onDragOver(e, idx)}
            onDragEnd={onDragEnd}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-grab active:cursor-grabbing
              ${dragging === idx ? 'border-teal-500/50 bg-teal-500/5' : 'border-white/10 bg-white/3 hover:border-white/20'}`}
          >
            <span className="text-white/20 text-lg mt-0.5 select-none">⠿</span>
            <div className={`w-1 self-stretch rounded-full ${exp.color?.replace('border-', 'bg-') || 'bg-teal-400'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{exp.org || 'Untitled'}</p>
              <p className="text-white/50 text-xs truncate">{exp.role} · {exp.duration}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleVisible(exp.id)}
                title={exp.visible ? 'Hide from public' : 'Show on public'}
                className={`p-1.5 rounded-lg transition-all text-sm ${exp.visible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'}`}
              >
                {exp.visible ? '👁' : '🙈'}
              </button>
              <button
                onClick={() => openEdit(exp)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => deleteExp(exp.id)}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {experiences.length === 0 && (
          <p className="text-white/30 text-center py-10">No experiences yet. Click "+ Add Experience" to start.</p>
        )}
      </div>

      {/* Edit / Add Modal */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={cancelEdit}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">
                    {editing === 'new' ? 'Add Experience' : 'Edit Experience'}
                  </h3>
                  <button onClick={cancelEdit} className="text-white/40 hover:text-white text-xl">✕</button>
                </div>

                <div className="space-y-4">
                  {/* Organization */}
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Organization</label>
                    <input
                      value={form.org}
                      onChange={(e) => setForm({ ...form, org: e.target.value })}
                      placeholder="e.g. National University of Singapore"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  {/* Role */}
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Role</label>
                    <input
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g. Research Intern"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  {/* Duration + Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Duration</label>
                      <input
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        placeholder="Apr 2026 – Present"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Location</label>
                      <input
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="Singapore · Remote"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Card Accent Color</label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setForm({ ...form, color: c.value })}
                          className={`px-3 py-1.5 rounded-lg text-xs border font-medium transition-all
                            ${form.color === c.value ? 'border-white/50 bg-white/15 text-white' : 'border-white/10 bg-white/3 text-white/50 hover:bg-white/10'}`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bullets */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider">Bullet Points</label>
                      <button onClick={addBullet} className="text-xs text-teal-400 hover:text-teal-300">+ Add</button>
                    </div>
                    <div className="space-y-2">
                      {form.bullets.map((b, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            value={b}
                            onChange={(e) => setBullet(i, e.target.value)}
                            placeholder={`Point ${i + 1}`}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500"
                          />
                          {form.bullets.length > 1 && (
                            <button onClick={() => removeBullet(i)} className="px-2 text-red-400 hover:text-red-300">✕</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Tech Stack Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.tags.map((t) => (
                        <span key={t} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70">
                          {t}
                          <button onClick={() => removeTag(t)} className="text-white/30 hover:text-red-400 ml-0.5">✕</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Type tag, press Enter"
                        className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500"
                      />
                      <button onClick={addTag} className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm">Add</button>
                    </div>
                  </div>

                  {/* Visibility toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setForm({ ...form, visible: !form.visible })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${form.visible ? 'bg-teal-500' : 'bg-white/10'}`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${form.visible ? 'translate-x-6' : ''}`} />
                    </button>
                    <span className="text-sm text-white/70">{form.visible ? 'Visible on portfolio' : 'Hidden from portfolio'}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={saveEdit}
                    className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-all active:scale-[0.98]"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Simple List Editor (Projects, Skills, Certifications, Research) ─────────
const SimpleListEditor = ({ section, data, onChange, fieldDefs }) => {
  const items = data[section] || [];
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const emptyForm = () => fieldDefs.reduce((acc, f) => ({ ...acc, [f.key]: f.default ?? '' }), { id: `item-${Date.now()}`, visible: true, order: items.length });

  const openNew = () => { setForm(emptyForm()); setEditing('new'); };
  const openEdit = (item) => { setForm({ ...item }); setEditing(item.id); };
  const cancelEdit = () => setEditing(null);
  const saveEdit = () => {
    const updated = editing === 'new' ? [...items, form] : items.map((i) => (i.id === editing ? form : i));
    onChange({ ...data, [section]: updated });
    setEditing(null);
  };
  const deleteItem = (id) => onChange({ ...data, [section]: items.filter((i) => i.id !== id) });
  const toggleVisible = (id) => onChange({ ...data, [section]: items.map((i) => i.id === id ? { ...i, visible: !i.visible } : i) });

  // Drag reorder
  const [dragging, setDragging] = useState(null);
  const onDragStart = (e, idx) => { setDragging(idx); };
  const onDragOver = (e, idx) => {
    e.preventDefault();
    if (dragging === null || dragging === idx) return;
    const arr = [...items];
    const [moved] = arr.splice(dragging, 1);
    arr.splice(idx, 0, moved);
    onChange({ ...data, [section]: arr.map((e, i) => ({ ...e, order: i })) });
    setDragging(idx);
  };
  const onDragEnd = () => setDragging(null);

  const displayKey = fieldDefs[0]?.key || 'title';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white capitalize">{section}</h2>
        <button onClick={openNew} className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all active:scale-95">
          + Add {section.replace(/s$/, '')}
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, idx)}
            onDragOver={(e) => onDragOver(e, idx)}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-grab
              ${dragging === idx ? 'border-teal-500/50 bg-teal-500/5' : 'border-white/10 bg-white/3 hover:border-white/20'}`}
          >
            <span className="text-white/20 select-none">⠿</span>
            <p className="flex-1 text-white text-sm truncate">{item[displayKey] || 'Untitled'}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleVisible(item.id)} className={`p-1.5 rounded-lg text-sm ${item.visible !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                {item.visible !== false ? '👁' : '🙈'}
              </button>
              <button onClick={() => openEdit(item)} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium transition-all">Edit</button>
              <button onClick={() => deleteItem(item.id)} className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-all">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/30 text-center py-10">No items yet.</p>}
      </div>

      <AnimatePresence>
        {editing && (
          <>
            <motion.div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={cancelEdit} />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">{editing === 'new' ? 'Add' : 'Edit'} Item</h3>
                  <button onClick={cancelEdit} className="text-white/40 hover:text-white text-xl">✕</button>
                </div>
                <div className="space-y-4">
                  {fieldDefs.map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">{f.label}</label>
                      {f.type === 'textarea' ? (
                        <textarea
                          value={form[f.key] || ''}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          placeholder={f.placeholder || ''}
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500 resize-none"
                        />
                      ) : (
                        <input
                          type={f.type || 'text'}
                          value={form[f.key] || ''}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          placeholder={f.placeholder || ''}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500"
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <button onClick={() => setForm({ ...form, visible: !form.visible })} className={`relative w-12 h-6 rounded-full transition-colors ${form.visible !== false ? 'bg-teal-500' : 'bg-white/10'}`}>
                      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${form.visible !== false ? 'translate-x-6' : ''}`} />
                    </button>
                    <span className="text-sm text-white/70">{form.visible !== false ? 'Visible' : 'Hidden'}</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={saveEdit} className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-all">Save</button>
                  <button onClick={cancelEdit} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-all">Cancel</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── About Editor ─────────────────────────────────────────────────────────────
const AboutEditor = ({ data, onChange }) => {
  const about = data.about || {};
  const [bio, setBio] = useState(about.bio || '');
  const [focus, setFocus] = useState((about.focusAreas || []).join('\n'));

  const save = () => {
    onChange({ ...data, about: { bio, focusAreas: focus.split('\n').map((s) => s.trim()).filter(Boolean) } });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">About Section</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Bio / Description</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500 resize-none" />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Focus Areas (one per line)</label>
          <textarea value={focus} onChange={(e) => setFocus(e.target.value)} rows={6} placeholder="Data Structures and Algorithms&#10;Machine Learning & AI&#10;..." 
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500 resize-none" />
        </div>
        <button onClick={save} className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-all active:scale-[0.98]">
          Update About
        </button>
      </div>
    </div>
  );
};

// ─── Resume Editor ─────────────────────────────────────────────────────────────
const ResumeEditor = ({ data, onChange }) => {
  const resume = data.resume || {};
  const [url, setUrl] = useState(resume.url || '');
  const [visible, setVisible] = useState(resume.visible !== false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const save = () => onChange({ ...data, resume: { url, visible } });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      try {
        const token = sessionStorage.getItem('adminToken');
        const res = await fetch(`${API_BASE}/api/admin/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
          body: JSON.stringify({ filename: file.name, data: base64, mimeType: file.type }),
        });
        const j = await res.json();
        if (j.url) {
          setUrl(`${API_BASE}${j.url}`);
        }
      } catch (err) {
        console.error('Upload failed', err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Resume</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Resume URL (PDF / Google Drive link)</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500" />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">Or upload a PDF</label>
          <input type="file" accept=".pdf" ref={fileRef} onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm border border-white/10 transition-all flex items-center gap-2 disabled:opacity-50">
            {uploading && <Spinner />}
            {uploading ? 'Uploading…' : '📎 Upload PDF'}
          </button>
          {url && <p className="text-xs text-white/40 mt-2 truncate">Current: {url}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setVisible(!visible)} className={`relative w-12 h-6 rounded-full transition-colors ${visible ? 'bg-teal-500' : 'bg-white/10'}`}>
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${visible ? 'translate-x-6' : ''}`} />
          </button>
          <span className="text-sm text-white/70">{visible ? 'Show resume button' : 'Hide resume button'}</span>
        </div>
        <button onClick={save} className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-all active:scale-[0.98]">
          Save Resume
        </button>
      </div>
    </div>
  );
};

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
const AdminDashboard = ({ token, onLogout }) => {
  const [activeSection, setActiveSection] = useState('experience');
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/admin/data`, { headers: { 'x-admin-token': token } })
      .then((r) => r.json())
      .then((d) => { setPortfolioData(d); setLoading(false); })
      .catch((e) => { showToast('Failed to load data: ' + e.message, 'error'); setLoading(false); });
  }, [token]);

  const handleDataChange = (newData) => {
    setPortfolioData(newData);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/data`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify(portfolioData),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Save failed');
      setHasChanges(false);
      showToast('Changes saved! Portfolio updated instantly.', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/admin/logout`, { method: 'POST', headers: { 'x-admin-token': token } });
    } catch (_) {}
    sessionStorage.removeItem('adminToken');
    onLogout();
  };

  const renderSection = () => {
    if (loading || !portfolioData) return (
      <div className="flex items-center justify-center h-64 gap-3 text-white/40">
        <Spinner /> Loading data…
      </div>
    );

    const projectFields = [
      { key: 'title', label: 'Title', placeholder: 'Project name' },
      { key: 'category', label: 'Category', placeholder: 'e.g. AI/GenAI' },
      { key: 'descShort', label: 'Short Description', type: 'textarea', placeholder: 'Brief description' },
      { key: 'tags', label: 'Tags (comma separated)', placeholder: 'React, Node.js, Python' },
      { key: 'repo', label: 'GitHub Repo URL', placeholder: 'https://github.com/...' },
      { key: 'live', label: 'Live URL', placeholder: 'https://...' },
    ];
    const skillFields = [
      { key: 'title', label: 'Category Title', placeholder: 'e.g. Frontend Development' },
      { key: 'items', label: 'Skills (comma separated)', placeholder: 'React, TypeScript, CSS' },
    ];
    const certFields = [
      { key: 'title', label: 'Certification Title', placeholder: 'e.g. AWS Certification' },
      { key: 'issuer', label: 'Issuer', placeholder: 'e.g. Coursera' },
      { key: 'url', label: 'Certificate URL', placeholder: 'https://...' },
    ];
    const researchFields = [
      { key: 'title', label: 'Research Title', placeholder: 'e.g. Transformer Architecture Study' },
      { key: 'org', label: 'Organization', placeholder: 'e.g. NUS' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description' },
      { key: 'url', label: 'Paper / Link URL', placeholder: 'https://...' },
    ];

    switch (activeSection) {
      case 'experience':
        return <ExperienceEditor data={portfolioData} onChange={handleDataChange} />;
      case 'projects':
        return <SimpleListEditor section="projects" data={portfolioData} onChange={handleDataChange} fieldDefs={projectFields} />;
      case 'skills':
        return <SimpleListEditor section="skills" data={portfolioData} onChange={handleDataChange} fieldDefs={skillFields} />;
      case 'certifications':
        return <SimpleListEditor section="certifications" data={portfolioData} onChange={handleDataChange} fieldDefs={certFields} />;
      case 'about':
        return <AboutEditor data={portfolioData} onChange={handleDataChange} />;
      case 'resume':
        return <ResumeEditor data={portfolioData} onChange={handleDataChange} />;
      case 'research':
        return <SimpleListEditor section="research" data={portfolioData} onChange={handleDataChange} fieldDefs={researchFields} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-black/80 backdrop-blur-lg border-b border-white/10 flex items-center px-4 gap-4">
        <a href="#home" className="text-sm text-white/40 hover:text-white transition-colors">← Back to Portfolio</a>
        <span className="text-white/20">|</span>
        <span className="text-sm font-semibold text-white">Admin Panel</span>
        <div className="ml-auto flex items-center gap-3">
          {hasChanges && <Badge color="yellow">Unsaved changes</Badge>}
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white text-sm font-semibold transition-all active:scale-95"
          >
            {saving && <Spinner />}
            {saving ? 'Saving…' : '💾 Save & Publish'}
          </button>
          <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-all">
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 border-r border-white/10 bg-black/50 p-4 fixed top-14 bottom-0 left-0 overflow-y-auto">
          <p className="text-xs text-white/20 uppercase tracking-widest mb-4 px-2">Sections</p>
          <nav className="flex flex-col gap-1">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left
                  ${activeSection === item.id
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile nav tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-black/90 backdrop-blur-lg border-t border-white/10 flex overflow-x-auto">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-3 text-xs shrink-0 transition-all
                ${activeSection === item.id ? 'text-teal-400' : 'text-white/40'}`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 md:ml-56 p-6 md:p-10 pb-24 md:pb-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

// ─── Root AdminPanel (handles auth state) ─────────────────────────────────────
const AdminPanel = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || null);

  const handleLogin = (t) => {
    sessionStorage.setItem('adminToken', t);
    setToken(t);
  };

  const handleLogout = () => {
    setToken(null);
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;
  return <AdminDashboard token={token} onLogout={handleLogout} />;
};

export default AdminPanel;
