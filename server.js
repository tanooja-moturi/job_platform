require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/server/config/db');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Enforce required environment variables
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in the environment variables.');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in the environment variables.');
  process.exit(1);
}

// Ensure upload directory exists (for resume file storage)
const uploadDir = path.join(__dirname, 'src', 'server', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Trust reverse proxy (e.g. Render, Heroku) for accurate client IP in rate limiting
app.set('trust proxy', 1);

// ── CORS ──────────────────────────────────────────────────────────────────────
// Supports multiple allowed origins via FRONTEND_URL (comma-separated if needed)
// Normalizes origins by trimming whitespace and stripping trailing slashes
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Postman, Render health checks, curl)
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    // Deny disallowed origins gracefully without throwing an uncaught 500 error
    return callback(null, false);
  },
  credentials: true,
}));

// ── Core Middleware ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
// Render and other platforms ping this to verify the service is alive
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Job Board API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ── Global API Rate Limiting ───────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
});

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);
app.use('/api/auth', require('./src/server/routes/auth'));
app.use('/api/jobs', require('./src/server/routes/jobs'));
app.use('/api/applications', require('./src/server/routes/applications'));

// ── 404 handler for unknown API routes ────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route not found: ${req.originalUrl}` });
});

// ── Root route — confirms API is live ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Job Board API is running.',
    version: '1.0.0',
    docs: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      applications: '/api/applications',
      health: '/health',
    },
  });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use(require('./src/server/middleware/errorHandler'));

// ── Start Server ───────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Job Board API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`✅ Allowed CORS origins: ${allowedOrigins.join(', ')}`);
  });
});

