"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const models_1 = require("./models");
const app = (0, express_1.default)();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
app.use(express_1.default.json());
app.get('/api/health', (_request, response) => {
    const connected = database_1.default.readyState === 1;
    response.status(connected ? 200 : 503).json({
        status: connected ? 'ok' : 'unavailable',
        database: connected ? 'connected' : 'disconnected',
    });
});
app.get('/api/users', async (_request, response) => {
    try {
        const users = await models_1.UserModel.find().select('-__v').sort({ displayName: 1 }).lean();
        response.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        response.status(500).json({ error: 'Failed to fetch users' });
    }
});
app.get('/api/activities', async (_request, response) => {
    try {
        const activities = await models_1.ActivityModel.find()
            .select('-__v -seedKey')
            .populate('user', 'username displayName')
            .populate('team', 'name slug')
            .sort({ occurredAt: -1 })
            .lean();
        response.json(activities);
    }
    catch (error) {
        console.error('Error fetching activities:', error);
        response.status(500).json({ error: 'Failed to fetch activities' });
    }
});
app.listen(port, () => {
    console.log(`OctoFit API listening on port ${port}`);
    console.log(`API base URL: ${apiBaseUrl}`);
});
