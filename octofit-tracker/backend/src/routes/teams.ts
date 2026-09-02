import { Router } from 'express';
import Team from '../models/Team.js';

const router = Router();

// List teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().limit(100);
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Get team by id
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members leaderId', '-password');
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Create team
router.post('/', async (req, res) => {
  try {
    const created = await Team.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create team' });
  }
});

// Update team
router.put('/:id', async (req, res) => {
  try {
    const updated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Team not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update team' });
  }
});

// Delete team
router.delete('/:id', async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

export default router;
