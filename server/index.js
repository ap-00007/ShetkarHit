// server/index.js (reloaded)
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { translateHandler } from './routes/translate.js';
import { detectHandler } from './routes/detect.js';
import { askHandler, askStreamHandler } from './routes/ask.js';
import { sendOtpHandler, verifyOtpHandler } from './routes/otp.js';
import { todayHandler } from './routes/today.js';
import { schemesHandler } from './routes/schemes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

// ── Validate env ──────────────────────────────────────
if (!process.env.HF_API_KEY || process.env.HF_API_KEY === 'your_huggingface_token_here') {
  console.warn('\n⚠️  HF_API_KEY not set in server/.env');
  console.warn('   /api/ask will return 503 until it is set.');
  console.warn('   Get a free token at: https://huggingface.co/settings/tokens\n');
}
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
  console.warn('\n⚠️  GEMINI_API_KEY not set in server/.env');
  console.warn('   /api/translate and /api/detect-lang will return 503 until it is set.\n');
}

const app = express();

// ── Middleware ────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json({ limit: '32kb' }));

// ── Request logger (dev) ──────────────────────────────
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ── API Routes ────────────────────────────────────────
app.post('/api/translate', translateHandler);
app.post('/api/detect-lang', detectHandler);
app.post('/api/ask', askHandler);
app.post('/api/ask/stream', askStreamHandler);
app.post('/api/otp/send', sendOtpHandler);
app.post('/api/otp/verify', verifyOtpHandler);
app.post('/api/today', todayHandler);
app.get('/api/schemes', schemesHandler);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
    ),
  });
});

// ── Serve Vite build in production ────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// ── Start ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌱 ShetkariHit API server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
