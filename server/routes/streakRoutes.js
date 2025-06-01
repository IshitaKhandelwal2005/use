const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streakController');
// You might need authentication middleware here (e.g., verifyToken)
// const auth = require('../middleware/auth');

// Route to update/calculate user streak.
// This route can be called when a user finishes a test, or just on page load
// to check for missed days.
router.post('/user/:userId/streak', streakController.updateUserStreak);

// Route to simply get the current streak (optional, but good for display)
router.get('/user/:userId/streak', streakController.getStreak);

module.exports = router; 