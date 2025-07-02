import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createDB, DB } from '../db';
import * as sermons from './v1/sermons';
import * as parts from './v1/parts';
import * as stream from './v1/stream';

interface Env {
  DB: D1Database;
  AUDIO_BUCKET: R2Bucket;
}

interface ContextWithDB {
  db: DB;
  audioBucket: R2Bucket;
}

const app = new Hono<{ Bindings: Env; Variables: ContextWithDB }>();

// CORS middleware - More permissive for development
app.use('*', cors({
  origin: (origin) => {
    // Allow all localhost origins for development
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return origin;
    }
    // Add your production domain here when deploying
    return null;
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Range', 'If-Range', 'If-Modified-Since'],
  exposeHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length', 'Last-Modified', 'ETag'],
  credentials: true,
}));

// Database and R2 middleware
app.use('*', async (c, next) => {
  const d1 = c.env.DB;
  const db = createDB(d1);
  c.set('db', db);
  c.set('audioBucket', c.env.AUDIO_BUCKET);
  await next();
});

// API routes
const api = new Hono();

// Sermons routes
api.get('/sermons', sermons.getAllSermons);
api.get('/sermons/:id', sermons.getSermonById);
api.get('/sermons/:sermonId/parts', sermons.getSermonParts);

// Parts routes
api.get('/parts/:id', parts.getSermonPartById);
api.get('/parts/:id/stream', parts.streamAudio);

// Audio streaming routes
api.get('/audio/:id', stream.streamAudioFile);

// Mount API under /api/v1
app.route('/api/v1', api);

// Health check
app.get('/', (c) => c.json({ status: 'ok', message: 'Spiritual Streams API' }));

// CORS test endpoint
app.get('/cors-test', (c) => c.json({ 
  status: 'ok', 
  message: 'CORS is working!',
  timestamp: new Date().toISOString()
}));

// Handle preflight requests
app.options('*', (c) => {
  return new Response(null, { status: 204 });
});

export default app;
