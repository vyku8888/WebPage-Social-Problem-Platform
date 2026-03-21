const express = require('express');
const router = express.Router();
const { getIssues, getIssueById, createIssue, voteIssue, deleteIssue, updateIssueStatus } = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getIssues).post(protect, createIssue);
router.route('/:id').get(getIssueById).delete(protect, deleteIssue);
router.route('/:id/status').put(protect, updateIssueStatus);
router.route('/:id/vote').post(protect, voteIssue);

module.exports = router;
