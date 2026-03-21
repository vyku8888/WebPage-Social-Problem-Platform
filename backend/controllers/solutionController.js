const Solution = require('../models/Solution');
const Vote = require('../models/Vote');
const User = require('../models/User');

// @desc    Get solutions for an issue
// @route   GET /api/solutions/:issueId
// @access  Public
const getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({ issue: req.params.issueId }).populate('author', 'name').sort({ votes: -1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a solution
// @route   POST /api/solutions
// @access  Private
const createSolution = async (req, res) => {
  const { description, issueId } = req.body;
  try {
    const solution = new Solution({
      description,
      issue: issueId,
      author: req.user._id,
    });
    const createdSolution = await solution.save();

    // Reward solution author explicitly
    await User.findByIdAndUpdate(req.user._id, { $inc: { credits: 5, score: 5 } });

    res.status(201).json(createdSolution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vote on a solution
// @route   POST /api/solutions/:id/vote
// @access  Private
const voteSolution = async (req, res) => {
  try {
    const solutionId = req.params.id;
    const userId = req.user._id;

    const solution = await Solution.findById(solutionId);
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }

    const existingVote = await Vote.findOne({ user: userId, solution: solutionId });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted on this solution.' });
    }

    const vote = new Vote({ user: userId, solution: solutionId });
    await vote.save();

    solution.votes += 1;
    await solution.save();

    res.json({ message: 'Vote recorded', votes: solution.votes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSolutions, createSolution, voteSolution };
