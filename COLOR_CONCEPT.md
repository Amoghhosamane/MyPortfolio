# Design System & Color Concept Guidelines

## Core Philosophy
This document establishes the permanent, consistent visual design rules for the portfolio.
The aesthetic is strictly **minimal, editorial dark**, inspired by **Linear, Vercel, and Stripe**, utilizing **only our blue color concept**.

---

## 1. Official Color Palette

| Token / Role | Hex / HSL Value | Tailwind Utility Equivalent | Description |
| :--- | :--- | :--- | :--- |
| **Primary Accent** | `#2563EB` / `#3B82F6` | `bg-blue-600`, `text-blue-500`, `text-blue-400` | Main interactive highlights, primary CTA buttons |
| **Soft Blue Eyebrows & Badges** | `#60A5FA` / `#93C5FD` | `text-blue-400`, `text-blue-300` | Section eyebrows, uppercase category tags, active dots |
| **Background (Near-Black)** | `#07090E` / `#0A0D14` | `bg-[#07090E]`, `bg-[#0A0D14]` | Deepest layer background with radial blue glow |
| **Card Surface (Dark Navy)** | `#0D131F` / `#0F172A` | `bg-[#0D131F]`, `bg-slate-900` | Subtle surface containers for project cards and forms |
| **Inner Sub-surfaces** | `#131C2E` / `#1E293B` | `bg-[#131C2E]`, `bg-slate-800/80` | Inner input fields, code blocks, and dialog boxes |
| **Borders & Dividers** | `#1E293B` / `#293548` | `border-slate-800`, `border-[#1E293B]` | Thin, crisp structural borders |
| **Primary Text** | `#FFFFFF` / `#F8FAFC` | `text-white` | Titles, card headers, high-contrast values |
| **Muted Secondary Text** | `#94A3B8` / `#64748B` | `text-slate-400`, `text-slate-500` | Subtitles, body paragraphs, meta timestamps |

---

## 2. Color Prohibitions
- **NO Teal or Cyan (`#2dd4bf`, `#14b8a6`, etc.)** — Replaced universally with Royal Blue (`#2563EB`) and Electric/Sky Blue (`#3B82F6` / `#60A5FA`).
- **NO Green, Red, or Yellow accent badges or buttons** — Status indicators should be Blue or neutral slate.
- **NO Toy/AI Gradients** — Keep surfaces flat or extremely subtle navy gradients (`from-[#0D131F] to-[#0A0D14]`).

---

## 3. Component Color Standards

### A. Buttons & CTAs
- **Primary Action Button (e.g., "Book 30-Min Call", "Send Message"):**
  ```jsx
  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
  ```
- **Secondary Action Button (e.g., "Open in Calendly", "GitHub"):**
  ```jsx
  className="bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-slate-800 hover:border-slate-700 font-medium"
  ```

### B. Eyebrows & Category Indicators
- **Mono Uppercase Eyebrow:**
  ```jsx
  className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase"
  ```
- **Bullet Point Indicator:**
  ```jsx
  className="w-2 h-2 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
  ```

### C. Input Fields & Form Controls
- **Background:** `rgba(255, 255, 255, 0.04)` or `#131C2E`
- **Border:** `border-slate-800`
- **Focus Ring & Border:** `focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50`
- **Text:** `text-white`
- **Placeholder:** `placeholder:text-slate-500`

---

## 4. Typography Rules
- **Headers:** Crisp sans-serif (`Space Grotesk` or system sans) with tight letter tracking (`tracking-tight`).
- **Metadata, Timestamps & Labels:** Monospace (`font-mono`) uppercase with wide tracking (`tracking-wider`).
- **Body Text:** Muted cool-grey (`text-slate-400`), font-light or regular, line-height `leading-relaxed`.
