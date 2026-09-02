import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database.js';

import usersRouter from './routes/users.js';
import teamsRouter from './routes/teams.js';
import activitiesRouter from './routes/activities.js';
import leaderboardRouter from './routes/leaderboard.js';
import workoutsRouter from './routes/workouts.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

// CORS origins (include Codespaces preview hosts when available)
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [frontendUrl, apiBaseUrl];
if (codespaceName) {
  allowedOrigins.push(`https://${codespaceName}-5173.app.github.dev`);
  allowedOrigins.push(`https://${codespaceName}-8000.githubpreview.dev`);
  allowedOrigins.push(`https://${codespaceName}-8000.preview.app.github.dev`);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS policy: origin not allowed'));
    },
  })
);

app.use(express.json());

// Mount API routes
app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/workouts', workoutsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/config', (req, res) => {
  res.json({ apiBaseUrl, environment: process.env.NODE_ENV || 'development' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API base URL: ${apiBaseUrl}`);
});

export default app;
