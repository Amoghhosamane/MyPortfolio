import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Admin config
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DATA_FILE = path.join(__dirname, 'portfolio-data.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Ensure uploads directory exists
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ─── Database Setup (MongoDB + File Fallback) ─────────────────────────────────
let mongoClient = null;
let dbCollection = null;

async function initDatabase() {
  if (!MONGODB_URI) {
    console.log('ℹ️  No MONGODB_URI provided. Storing portfolio data in portfolio-data.json file.');
    return;
  }

  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    const db = mongoClient.db('portfolio_db');
    dbCollection = db.collection('portfolio_data');
    console.log('✅ Connected permanently to MongoDB Atlas database.');

    // Seed database from portfolio-data.json if MongoDB collection is empty
    const existing = await dbCollection.findOne({ _id: 'portfolio_main' });
    if (!existing) {
      const fileData = readFromFile();
      await dbCollection.updateOne(
        { _id: 'portfolio_main' },
        { $set: { _id: 'portfolio_main', ...fileData, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log('🌱 Seeded MongoDB database from local portfolio-data.json.');
    }
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed, falling back to portfolio-data.json:', err.message);
    dbCollection = null;
  }
}

function readFromFile() {
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    return { experiences: [], projects: [], skills: [], certifications: [], about: {}, resume: {}, research: [] };
  }
}

function writeToFile(data) {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing to portfolio-data.json:', e.message);
  }
}

async function getPortfolioData() {
  if (dbCollection) {
    try {
      const doc = await dbCollection.findOne({ _id: 'portfolio_main' });
      if (doc) {
        const { _id, updatedAt, ...cleanData } = doc;
        return cleanData;
      }
    } catch (e) {
      console.warn('Error reading from MongoDB, using file fallback:', e.message);
    }
  }
  return readFromFile();
}

async function savePortfolioData(newData) {
  // Always update local file as persistent backup
  writeToFile(newData);

  // If MongoDB is connected, save permanently into database
  if (dbCollection) {
    try {
      await dbCollection.updateOne(
        { _id: 'portfolio_main' },
        { $set: { _id: 'portfolio_main', ...newData, updatedAt: new Date() } },
        { upsert: true }
      );
    } catch (e) {
      console.error('Error writing to MongoDB:', e.message);
      throw new Error('Database save failed: ' + e.message);
    }
  }
}

// Simple in-memory token store (single user, personal portfolio)
let adminToken = null;

// Required for express-rate-limit to work correctly on Render/Vercel
app.set('trust proxy', 1);

// Security + middleware
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Middleware to prevent caching on dynamic API routes
const noCacheMiddleware = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// ─── Middleware: verify admin token ─────────────────────────────────────────
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || token !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized. Please login again.' });
  }
  next();
}

// ─── Public API ──────────────────────────────────────────────────────────────

// Root health check
app.get('/', (req, res) => {
  res.send('Portfolio server is running. Database: ' + (dbCollection ? 'MongoDB Connected' : 'Local JSON'));
});

// GET /api/portfolio — public, returns visible data from database
app.get('/api/portfolio', noCacheMiddleware, async (req, res) => {
  try {
    const data = await getPortfolioData();
    const publicData = {
      ...data,
      experiences: (data.experiences || [])
        .filter(e => e.visible !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    };
    res.json(publicData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve portfolio data: ' + err.message });
  }
});

// ─── Admin Auth ──────────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  // Generate random token
  adminToken = Math.random().toString(36).slice(2) + Date.now().toString(36);
  res.json({ token: adminToken });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  adminToken = null;
  res.json({ ok: true });
});

// ─── Admin Data CRUD ─────────────────────────────────────────────────────────

// GET all data (admin view — always fresh from database)
app.get('/api/admin/data', [noCacheMiddleware, requireAdmin], async (req, res) => {
  try {
    const data = await getPortfolioData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data from database: ' + err.message });
  }
});

// PUT — overwrite & store permanently into database
app.put('/api/admin/data', [noCacheMiddleware, requireAdmin], async (req, res) => {
  try {
    const newData = req.body;
    if (!newData || typeof newData !== 'object') {
      return res.status(400).json({ error: 'Invalid data payload' });
    }
    await savePortfolioData(newData);
    res.json({ ok: true, message: 'Portfolio data saved permanently in database!' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save to database: ' + e.message });
  }
});

// POST /api/admin/upload — file upload as base64
app.post('/api/admin/upload', requireAdmin, (req, res) => {
  try {
    const { filename, data: base64Data } = req.body || {};
    if (!filename || !base64Data) {
      return res.status(400).json({ error: 'Missing filename or data' });
    }
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

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => console.log(`🚀 Portfolio server listening on port ${PORT}`));
});