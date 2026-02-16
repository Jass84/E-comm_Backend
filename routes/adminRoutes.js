const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin routes will be implemented in later phases
// Placeholder for now

router.get('/dashboard', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin dashboard route - To be implemented' });
});

module.exports = router;
