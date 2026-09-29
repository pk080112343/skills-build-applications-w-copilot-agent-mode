import mongoose, { Types } from 'mongoose';
import {
  ActivityModel,
  LeaderboardModel,
  TeamModel,
  UserModel,
  WorkoutModel,
} from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    const seededUsers = [
      { username: 'ava-chen', email: 'ava.chen@example.test', displayName: 'Ava Chen', grade: 10, totalPoints: 185 },
      { username: 'noah-reyes', email: 'noah.reyes@example.test', displayName: 'Noah Reyes', grade: 11, totalPoints: 160 },
      { username: 'maya-patel', email: 'maya.patel@example.test', displayName: 'Maya Patel', grade: 9, totalPoints: 135 },
    ];
    const users = new Map<string, Types.ObjectId>();

    for (const user of seededUsers) {
      const savedUser = await UserModel.findOneAndUpdate(
        { username: user.username },
        { $set: user },
        { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true },
      );
      users.set(user.username, savedUser._id);
    }

    const teamDefinitions = [
      { slug: 'trailblazers', name: 'Trailblazers', description: 'Build endurance one step at a time.', members: ['ava-chen', 'maya-patel'] },
      { slug: 'power-players', name: 'Power Players', description: 'Strength, consistency, and teamwork.', members: ['noah-reyes'] },
    ];
    const teams = new Map<string, Types.ObjectId>();

    for (const team of teamDefinitions) {
      const savedTeam = await TeamModel.findOneAndUpdate(
        { slug: team.slug },
        { $set: { ...team, members: team.members.map((username) => users.get(username)!) } },
        { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true },
      );
      teams.set(team.slug, savedTeam._id);
    }

    const seededActivities = [
      { seedKey: 'ava-chen-run-1', username: 'ava-chen', teamSlug: 'trailblazers', type: 'running' as const, durationMinutes: 28, distanceKm: 3.2, points: 70, occurredAt: new Date('2026-09-20T15:00:00Z') },
      { seedKey: 'ava-chen-strength-1', username: 'ava-chen', teamSlug: 'trailblazers', type: 'strength' as const, durationMinutes: 25, points: 55, occurredAt: new Date('2026-09-22T15:00:00Z') },
      { seedKey: 'noah-reyes-walk-1', username: 'noah-reyes', teamSlug: 'power-players', type: 'walking' as const, durationMinutes: 42, distanceKm: 3.8, points: 60, occurredAt: new Date('2026-09-21T15:00:00Z') },
      { seedKey: 'maya-patel-run-1', username: 'maya-patel', teamSlug: 'trailblazers', type: 'running' as const, durationMinutes: 22, distanceKm: 2.4, points: 55, occurredAt: new Date('2026-09-23T15:00:00Z') },
    ];

    for (const activity of seededActivities) {
      const { username, teamSlug, ...activityData } = activity;
      await ActivityModel.findOneAndUpdate(
        { seedKey: activity.seedKey },
        { $set: { ...activityData, user: users.get(username)!, team: teams.get(teamSlug)! } },
        { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true },
      );
    }

    const seededWorkouts = [
      { slug: 'easy-run', title: 'Easy Run', description: 'A conversational-pace run to build aerobic fitness.', type: 'running' as const, durationMinutes: 20, difficulty: 'beginner' as const },
      { slug: 'brisk-walk', title: 'Brisk Walk', description: 'A steady walk with a comfortable, purposeful pace.', type: 'walking' as const, durationMinutes: 25, difficulty: 'beginner' as const },
      { slug: 'bodyweight-basics', title: 'Bodyweight Basics', description: 'A balanced circuit of squats, push-ups, and planks.', type: 'strength' as const, durationMinutes: 18, difficulty: 'beginner' as const },
    ];

    for (const workout of seededWorkouts) {
      await WorkoutModel.findOneAndUpdate(
        { slug: workout.slug },
        { $set: workout },
        { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true },
      );
    }

    const leaderboard = [
      { username: 'ava-chen', teamSlug: 'trailblazers', points: 185, rank: 1 },
      { username: 'noah-reyes', teamSlug: 'power-players', points: 160, rank: 2 },
      { username: 'maya-patel', teamSlug: 'trailblazers', points: 135, rank: 3 },
    ];

    for (const entry of leaderboard) {
      await LeaderboardModel.findOneAndUpdate(
        { period: '2026-09', user: users.get(entry.username)! },
        { $set: { ...entry, period: '2026-09', user: users.get(entry.username)!, team: teams.get(entry.teamSlug)! } },
        { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true },
      );
    }

    const [usersCount, teamsCount, activitiesCount, leaderboardCount, workoutsCount] = await Promise.all([
      UserModel.countDocuments(),
      TeamModel.countDocuments(),
      ActivityModel.countDocuments(),
      LeaderboardModel.countDocuments(),
      WorkoutModel.countDocuments(),
    ]);
    console.log('Database seeding complete:', {
      users: usersCount,
      teams: teamsCount,
      activities: activitiesCount,
      leaderboardEntries: leaderboardCount,
      workouts: workoutsCount,
    });
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDatabase();
