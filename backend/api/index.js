require('dotenv').config();
const app = require('../src/server');

// Vercel serverless function handler
module.exports = app;
