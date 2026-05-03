import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory simulation of a logging system
const telemetryLogs: any[] = [];

/**
 * Custom Portfolio Feature: Analytics Endpoint
 * Demonstrates backend capability for tracking AI usage and performance.
 */
app.post('/api/telemetry', (req, res) => {
  const { event, data } = req.body;
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ...data
  };
  telemetryLogs.push(entry);
  console.log(`[Telemetry] ${event}:`, data);
  res.status(202).json({ status: 'received' });
});

/**
 * Returns summary stats for the dashboard.
 */
app.get('/api/stats', (req, res) => {
  res.json({
    totalQueries: telemetryLogs.length,
    averageLatency: telemetryLogs.length > 0 
      ? telemetryLogs.reduce((acc, curr) => acc + (curr.processingTimeMs || 0), 0) / telemetryLogs.length 
      : 0
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MeetMind] Instance active at http://localhost:${PORT}`);
  });
}

startServer();
