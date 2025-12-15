// File: backend/src/server.js
// Load environment variables (only in development)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const feedbackRoutes = require('./routes/feedbackRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Employee Feedback Backend API ✅',
    status: 'running',
    endpoints: {
      health: '/health',
      feedback: '/feedback',
      auth: '/auth'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/feedback', feedbackRoutes);
app.use('/auth', authRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Export for Vercel serverless
module.exports = app;

// Start server (only for local development)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}
