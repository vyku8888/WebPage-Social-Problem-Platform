const express = require('express');
const router = express.Router();
const { getSolutions, createSolution, voteSolution } = require('../controllers/solutionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createSolution);
router.route('/:issueId').get(getSolutions);
router.route('/:id/vote').post(protect, voteSolution);

module.exports = router;
