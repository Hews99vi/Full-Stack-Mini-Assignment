const express = require('express');
const router = express.Router();

// Admin credentials (in production, these should be hashed and stored in database)
const ADMIN_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // In production, use bcrypt to hash passwords
    role: 'admin'
  }
];

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }

  // Find admin user
  const admin = ADMIN_USERS.find(
    user => user.username === username && user.password === password
  );

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }

  // Generate a simple token (in production, use JWT)
  const token = Buffer.from(`${admin.username}:${Date.now()}`).toString('base64');

  res.json({
    success: true,
    message: 'Login successful',
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      role: admin.role
    }
  });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  // In production, properly verify JWT token
  res.json({
    success: true,
    message: 'Token is valid'
  });
});

module.exports = router;
