/**
 * Seed the octofit_db database with test data
 *
 * This script will create users, teams, activities, workouts and a leaderboard snapshot.
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import db from '../config/database.js';
import User from '../models/User.js';
import Team from '../models/Team.js';
import Activity from '../models/Activity.js';
import Workout from '../models/Workout.js';
import Leaderboard from '../models/Leaderboard.js';

const CONNECTION = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

async function clearAll() {
  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    Workout.deleteMany({}),
    Leaderboard.deleteMany({}),
  ]);
}

async function seed() {
  console.log('Seed the octofit_db database with test data');

  await mongoose.connect(CONNECTION);

  await clearAll();

  // Create users
  const users = await User.create([
    {
      username: 'alice',
      email: 'alice@example.com',
      password: 'password',
      firstName: 'Alice',
      lastName: 'Johnson',
      totalPoints: 1250,
      totalActivities: 34,
    },
    {
      username: 'bob',
      email: 'bob@example.com',
      password: 'password',
      firstName: 'Bob',
      lastName: 'Smith',
      totalPoints: 980,
      totalActivities: 28,
    },
    {
      username: 'carla',
      email: 'carla@example.com',
      password: 'password',
      firstName: 'Carla',
      lastName: 'Diaz',
      totalPoints: 1420,
      totalActivities: 40,
    },
  ]);

  // Create teams
  const teams = await Team.create([
    {
      name: 'Team Red Rockets',
      description: 'Friendly neighborhood running team',
      leaderId: users[0]._id,
      members: [users[0]._id, users[1]._id],
      totalPoints: users[0].totalPoints + users[1].totalPoints,
    },
    {
      name: 'Team Blue Waves',
      description: 'Cycling and triathlon enthusiasts',
      leaderId: users[2]._id,
      members: [users[2]._id],
      totalPoints: users[2].totalPoints,
    },
  ]);

  // Create activities
  const now = new Date();
  await Activity.create([
    {
      userId: users[0]._id,
      activityType: 'running',
      duration: 30,
      distance: 5.0,
      caloriesBurned: 320,
      description: 'Morning neighborhood run',
      dateCompleted: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
      points: 100,
    },
    {
      userId: users[1]._id,
      activityType: 'cycling',
      duration: 60,
      distance: 20.0,
      caloriesBurned: 600,
      description: 'Evening endurance ride',
      dateCompleted: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1),
      points: 200,
    },
    {
      userId: users[2]._id,
      activityType: 'swimming',
      duration: 45,
      distance: 1.2,
      caloriesBurned: 400,
      description: 'Pool interval training',
      dateCompleted: now,
      points: 150,
    },
  ]);

  // Create workouts
  await Workout.create([
    { name: 'Quick 20-min Run', description: 'Easy tempo run', duration: 20, difficulty: 'medium' },
    { name: 'Full Body Strength', description: 'Circuit style strength workout', duration: 45, difficulty: 'hard' },
    { name: 'Morning Yoga Flow', description: 'Gentle mobility and breathing', duration: 30, difficulty: 'easy' },
  ]);

  // Build a simple leaderboard snapshot
  const topUsers = await User.find().select('-password').sort({ totalPoints: -1 }).limit(10);
  const topTeams = await Team.find().sort({ totalPoints: -1 }).limit(10);

  const entries: any[] = [];
  topUsers.forEach((u) => entries.push({ type: 'user', refId: u._id, name: `${u.firstName} ${u.lastName}`, points: u.totalPoints }));
  topTeams.forEach((t) => entries.push({ type: 'team', refId: t._id, name: t.name, points: t.totalPoints }));

  await Leaderboard.create({ generatedAt: new Date(), entries });

  console.log('Seeding complete');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    // TODO: Add seed data for users, teams, activities, leaderboard, and workouts

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
