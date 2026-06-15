import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Admin config
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DATA_FILE = path.join(__dirname, 'portfolio-data.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure uploads directory exists
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Simple in-memory token store (single user, personal portfolio)
let adminToken = null;

// Required for express-rate-limit to work correctly on Render/Vercel
app.set('trust proxy', 1);

// Security + middleware
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// Rate limiter for contact endpoint
const contactLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

// ─── Helper: read/write portfolio data ──────────────────────────────────────
function readData() {
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    return { experiences: [], projects: [], skills: [], certifications: [], about: {}, resume: {}, research: [] };
  }
}

function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Middleware: verify admin token ─────────────────────────────────────────
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || token !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ─── Public API ──────────────────────────────────────────────────────────────

// Root health check
app.get('/', (req, res) => {
    res.send('Portfolio server is running');
});

// GET /api/portfolio — public, returns visible data
app.get('/api/portfolio', (req, res) => {
  const data = readData();
  // Filter to only visible items for public view
  const publicData = {
    ...data,
    experiences: (data.experiences || [])
      .filter(e => e.visible !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  };
  res.json(publicData);
});

// ─── Admin Auth ──────────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  // Generate a simple random token
  adminToken = Math.random().toString(36).slice(2) + Date.now().toString(36);
  res.json({ token: adminToken });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  adminToken = null;
  res.json({ ok: true });
});

// ─── Admin Data CRUD ─────────────────────────────────────────────────────────

// GET all data (admin view — includes hidden items)
app.get('/api/admin/data', requireAdmin, (req, res) => {
  res.json(readData());
});

// PUT — overwrite entire portfolio data
app.put('/api/admin/data', requireAdmin, (req, res) => {
  try {
    const newData = req.body;
    if (!newData || typeof newData !== 'object') {
      return res.status(400).json({ error: 'Invalid data' });
    }
    writeData(newData);
    res.json({ ok: true, message: 'Portfolio data saved successfully.' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to write data: ' + e.message });
  }
});

// POST /api/admin/upload — file upload as base64
app.post('/api/admin/upload', requireAdmin, (req, res) => {
  try {
    const { filename, data: base64Data, mimeType } = req.body || {};
    if (!filename || !base64Data) {
      return res.status(400).json({ error: 'Missing filename or data' });
    }
    // Sanitize filename
    const safe = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    const unique = `${Date.now()}_${safe}`;
    const dest = path.join(UPLOADS_DIR, unique);
    const buffer = Buffer.from(base64Data, 'base64');
    writeFileSync(dest, buffer);
    res.json({ ok: true, url: `/uploads/${unique}` });
  } catch (e) {
    res.status(500).json({ error: 'Upload failed: ' + e.message });
  }
});



// Start server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));