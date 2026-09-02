import { Router } from 'express';
import User from '../models/User.js';
import Team from '../models/Team.js';

const router = Router();

// Top users by totalPoints
router.get('/users', async (req, res) => {
  try {
    const top = await User.find().select('-password').sort({ totalPoints: -1 }).limit(10);
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user leaderboard' });
  }
});

// Top teams by totalPoints
router.get('/teams', async (req, res) => {
  try {
    const top = await Team.find().sort({ totalPoints: -1 }).limit(10);
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team leaderboard' });
  }
});

// Combined leaderboard (simple merge)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ totalPoints: -1 }).limit(10);
    const teams = await Team.find().sort({ totalPoints: -1 }).limit(10);
    res.json({ users, teams });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
