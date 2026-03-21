const Issue = require('../models/Issue');
const Vote = require('../models/Vote');
const User = require('../models/User');

// @desc    Get all issues
// @route   GET /api/issues
// @access  Public
const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an issue
// @route   POST /api/issues
// @access  Private
const createIssue = async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const issue = new Issue({
      title,
      description,
      category,
      author: req.user._id,
    });
    const createdIssue = await issue.save();
    
    // Reward user mapping logic: +10 credits, +5 score for reporting issue
    await User.findByIdAndUpdate(req.user._id, { $inc: { credits: 10, score: 5, issuesReported: 1 } });

    res.status(201).json(createdIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get issue by ID
// @route   GET /api/issues/:id
// @access  Public
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('author', 'name');
    if (issue) {
      res.json(issue);
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vote on an issue
// @route   POST /api/issues/:id/vote
// @access  Private
const voteIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Check if user already voted
    const existingVote = await Vote.findOne({ user: req.user._id, issue: issueId });
    if (existingVote) {
      // Unvote Logic
      await Vote.findByIdAndDelete(existingVote._id);
      issue.totalVotes = Math.max(0, issue.totalVotes - 1);
      await issue.save();
      
      // Deduct credits from author safely (no negative score)
      const author = await User.findById(issue.author);
      if (author) {
        author.credits = Math.max(0, (author.credits || 0) - 2);
        author.score = Math.max(0, (author.score || 0) - 2);
        author.totalVotesReceived = Math.max(0, (author.totalVotesReceived || 0) - 1);
        await author.save();
      }
      
      return res.json({ message: 'Vote removed', totalVotes: issue.totalVotes, action: 'unvoted' });
    }

    // Vote Logic
    const vote = new Vote({
      user: req.user._id,
      issue: issueId,
    });
    await vote.save();

    issue.totalVotes += 1;
    await issue.save();

    // Reward the author of the issue: +2 credits, +2 score for engagement
    await User.findByIdAndUpdate(issue.author, { $inc: { credits: 2, score: 2, totalVotesReceived: 1 } });

    res.json({ message: 'Vote recorded', totalVotes: issue.totalVotes, action: 'voted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an issue
// @route   DELETE /api/issues/:id
// @access  Private
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Verify ownership
    if (issue.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this issue' });
    }

    // Cascade delete related records
    const Comment = require('../models/Comment');
    const Solution = require('../models/Solution');
    
    await Comment.deleteMany({ issue: issue._id });
    await Solution.deleteMany({ issue: issue._id });
    await Vote.deleteMany({ issue: issue._id });

    // Remove the issue itself
    await Issue.findByIdAndDelete(req.params.id);

    // Provide credit removal cleanly without going negative
    const reporter = await User.findById(req.user._id);
    if (reporter) {
      reporter.credits = Math.max(0, (reporter.credits || 0) - 10);
      reporter.score = Math.max(0, (reporter.score || 0) - 5);
      reporter.issuesReported = Math.max(0, (reporter.issuesReported || 0) - 1);
      await reporter.save();
    }

    res.json({ message: 'Issue removed completely' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update issue status
// @route   PUT /api/issues/:id/status
// @access  Private
const updateIssueStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Verify ownership
    if (issue.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to update this issue' });
    }

    issue.status = req.body.status || 'Resolved';
    const updatedIssue = await issue.save();
    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getIssues, createIssue, getIssueById, voteIssue, deleteIssue, updateIssueStatus };
