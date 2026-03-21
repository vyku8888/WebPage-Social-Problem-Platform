const express = require('express');
const router = express.Router();
const { getUserDashboard, getLeaderboard, getUserVotes } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getUserDashboard);
router.get('/leaderboard', getLeaderboard);
router.get('/votes', protect, getUserVotes);

module.exports = router;
