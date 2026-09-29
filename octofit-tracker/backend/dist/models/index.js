"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardModel = exports.WorkoutModel = exports.ActivityModel = exports.TeamModel = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    grade: { type: Number, required: true, min: 9, max: 12 },
    totalPoints: { type: Number, required: true, min: 0, default: 0 },
}, { timestamps: true });
const teamSchema = new mongoose_1.Schema({
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
const activitySchema = new mongoose_1.Schema({
    seedKey: { type: String, required: true, unique: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', required: true },
    type: { type: String, enum: ['running', 'walking', 'strength'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    points: { type: Number, required: true, min: 0 },
    occurredAt: { type: Date, required: true },
}, { timestamps: true });
const workoutSchema = new mongoose_1.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['running', 'walking', 'strength'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    difficulty: { type: String, enum: ['beginner', 'intermediate'], required: true },
}, { timestamps: true });
const leaderboardSchema = new mongoose_1.Schema({
    period: { type: String, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', required: true },
    points: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
}, { timestamps: true });
leaderboardSchema.index({ period: 1, user: 1 }, { unique: true });
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
exports.TeamModel = (0, mongoose_1.model)('Team', teamSchema);
exports.ActivityModel = (0, mongoose_1.model)('Activity', activitySchema);
exports.WorkoutModel = (0, mongoose_1.model)('Workout', workoutSchema);
exports.LeaderboardModel = (0, mongoose_1.model)('Leaderboard', leaderboardSchema);
