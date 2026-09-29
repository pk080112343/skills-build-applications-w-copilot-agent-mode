import express from 'express';
import cors from 'cors';
import database from './config/database';
import {
  ActivityModel,
  LeaderboardModel,
  TeamModel,
  UserModel,
  WorkoutModel,
} from './models';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(codespaceName ? [`https://${codespaceName}-5173.app.github.dev`] : []),
]);
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(cors({
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)),
  methods: ['GET', 'OPTIONS'],
}));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  const connected = database.readyState === 1;

  response.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'unavailable',
    database: connected ? 'connected' : 'disconnected',
  });
});

app.get('/api/users', async (_request, response) => {
  try {
    const users = await UserModel.find().select('-__v').sort({ displayName: 1 }).lean();
    response.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    response.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/activities', async (_request, response) => {
  try {
    const activities = await ActivityModel.find()
      .select('-__v -seedKey')
      .populate('user', 'username displayName')
      .populate('team', 'name slug')
      .sort({ occurredAt: -1 })
      .lean();
    response.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    response.status(500).json({ error: 'Failed to fetch activities' });
  }
});

app.get('/api/teams', async (_request, response) => {
  try {
    const teams = await TeamModel.find()
      .select('-__v')
      .populate('members', 'username displayName grade')
      .sort({ name: 1 })
      .lean();
    response.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    response.status(500).json({ error: 'Failed to fetch teams' });
  }
});

app.get('/api/leaderboard', async (_request, response) => {
  try {
    const leaderboard = await LeaderboardModel.find()
      .select('-__v')
      .populate('user', 'username displayName grade')
      .populate('team', 'name slug')
      .sort({ period: -1, rank: 1 })
      .lean();
    response.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    response.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.get('/api/workouts', async (_request, response) => {
  try {
    const workouts = await WorkoutModel.find().select('-__v').sort({ title: 1 }).lean();
    response.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    response.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

app.listen(port, () => {
  console.log(`OctoFit API listening on port ${port}`);
  console.log(`API base URL: ${apiBaseUrl}`);
});