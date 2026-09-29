import { model, Schema, Types } from 'mongoose';

export interface User {
  username: string;
  email: string;
  displayName: string;
  grade: number;
  totalPoints: number;
}

export interface Team {
  slug: string;
  name: string;
  description: string;
  members: Types.ObjectId[];
}

export interface Activity {
  seedKey: string;
  user: Types.ObjectId;
  team: Types.ObjectId;
  type: 'running' | 'walking' | 'strength';
  durationMinutes: number;
  distanceKm?: number;
  points: number;
  occurredAt: Date;
}

export interface Workout {
  slug: string;
  title: string;
  description: string;
  type: 'running' | 'walking' | 'strength';
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate';
}

export interface LeaderboardEntry {
  period: string;
  user: Types.ObjectId;
  team: Types.ObjectId;
  points: number;
  rank: number;
}

const userSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    grade: { type: Number, required: true, min: 9, max: 12 },
    totalPoints: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

const teamSchema = new Schema<Team>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

const activitySchema = new Schema<Activity>(
  {
    seedKey: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    type: { type: String, enum: ['running', 'walking', 'strength'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    points: { type: Number, required: true, min: 0 },
    occurredAt: { type: Date, required: true },
  },
  { timestamps: true },
);

const workoutSchema = new Schema<Workout>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['running', 'walking', 'strength'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    difficulty: { type: String, enum: ['beginner', 'intermediate'], required: true },
  },
  { timestamps: true },
);

const leaderboardSchema = new Schema<LeaderboardEntry>(
  {
    period: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    points: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
);
leaderboardSchema.index({ period: 1, user: 1 }, { unique: true });

export const UserModel = model<User>('User', userSchema);
export const TeamModel = model<Team>('Team', teamSchema);
export const ActivityModel = model<Activity>('Activity', activitySchema);
export const WorkoutModel = model<Workout>('Workout', workoutSchema);
export const LeaderboardModel = model<LeaderboardEntry>('Leaderboard', leaderboardSchema);