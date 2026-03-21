const User = require('../models/User');
const Issue = require('../models/Issue');
const Report = require('../models/Report');

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const userIssues = await Issue.find({ author: req.user._id }).sort({ createdAt: -1 });
    const userReports = await Report.find({ reporter: req.user._id }).sort({ createdAt: -1 });
    
    // Calculate rank computationally
    const topUsers = await User.find().sort({ score: -1 }).select('_id');
    const rank = topUsers.findIndex(u => u._id.toString() === req.user._id.toString()) + 1;

    // Derived stats
    const resolvedIssues = userIssues.filter(i => i.status === 'Resolved').length;
    const pendingIssues = userIssues.filter(i => i.status !== 'Resolved').length;

    // Determine badge based on credits dynamically (so it stays fresh)
    let currentBadge = 'Beginner';
    if (user.credits >= 150) currentBadge = 'Social Hero';
    else if (user.credits >= 100) currentBadge = 'Top Reporter';
    else if (user.credits >= 50) currentBadge = 'Active Citizen';
    else if (user.credits >= 20) currentBadge = 'Contributor';

    res.json({
      profile: { ...user._doc, rank, currentBadge },
      activity: {
        resolved: resolvedIssues,
        pending: pendingIssues,
      },
      issues: userIssues,
      reports: userReports
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user votes
// @route   GET /api/users/votes
// @access  Private
const getUserVotes = async (req, res) => {
  try {
    const Vote = require('../models/Vote');
    const votes = await Vote.find({ user: req.user._id }).select('issue');
    res.json(votes.map(v => v.issue));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find().sort({ score: -1 }).limit(20).select('name score credits issuesReported badge');
    
    const rankedUsers = topUsers.map((u, index) => {
      let currentBadge = 'Beginner';
      if (u.credits >= 150) currentBadge = 'Social Hero';
      else if (u.credits >= 100) currentBadge = 'Top Reporter';
      else if (u.credits >= 50) currentBadge = 'Active Citizen';
      else if (u.credits >= 20) currentBadge = 'Contributor';
      
      return { ...u._doc, rank: index + 1, currentBadge };
    });

    res.json(rankedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserDashboard, getLeaderboard, getUserVotes };
