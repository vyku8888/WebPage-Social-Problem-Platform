const Comment = require('../models/Comment');
const Issue = require('../models/Issue');
const User = require('../models/User');

// @desc    Get comments for an issue
// @route   GET /api/comments/:issueId
// @access  Public
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ issue: req.params.issueId }).populate('author', 'name').sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
  const { text, issueId } = req.body;
  try {
    const comment = new Comment({
      text,
      issue: issueId,
      author: req.user._id,
    });
    const createdComment = await comment.save();

    // The ISSUE author gets +1 credit and score for receiving comments
    const issueData = await Issue.findById(issueId);
    if(issueData) {
        await User.findByIdAndUpdate(issueData.author, { $inc: { credits: 1, score: 1, totalComments: 1 } });
    }

    res.status(201).json(createdComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComments, createComment };
