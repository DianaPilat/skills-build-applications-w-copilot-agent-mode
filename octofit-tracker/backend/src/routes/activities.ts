import { Router } from 'express';
import Activity from '../models/Activity.js';

const router = Router();

// List activities (recent first)
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ dateCompleted: -1 }).limit(200);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities', details: err instanceof Error ? err.message : String(err) });
  }
});

// Get activity by id
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('userId', '-password');
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Create activity
router.post('/', async (req, res) => {
  try {
    const created = await Activity.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create activity', details: err instanceof Error ? err.message : err });
  }
});

// Update activity
router.put('/:id', async (req, res) => {
  try {
    const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Activity not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update activity' });
  }
});

// Delete activity
router.delete('/:id', async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

export default router;
