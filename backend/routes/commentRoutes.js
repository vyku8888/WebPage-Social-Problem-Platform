const express = require('express');
const router = express.Router();
const { getComments, createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createComment);
router.route('/:issueId').get(getComments);

module.exports = router;
