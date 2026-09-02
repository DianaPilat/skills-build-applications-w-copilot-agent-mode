import { Router } from 'express';

const router = Router();

// Return a small set of sample workouts
const sampleWorkouts = [
  { id: 'w1', name: 'Quick 20-min Run', duration: 20, difficulty: 'medium' },
  { id: 'w2', name: 'Full Body Strength', duration: 45, difficulty: 'hard' },
  { id: 'w3', name: 'Morning Yoga Flow', duration: 30, difficulty: 'easy' },
];

router.get('/', (req, res) => {
  res.json(sampleWorkouts);
});

// Echo-create a workout (no persistence yet)
router.post('/', (req, res) => {
  const payload = req.body;
  const created = { id: `w_${Date.now()}`, ...payload };
  res.status(201).json(created);
});

export default router;
