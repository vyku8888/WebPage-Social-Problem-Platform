const express = require('express');
const router = express.Router();
const { getReports, createReport, deleteReport, updateReportStatus } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getReports)
  .post(protect, upload.single('image'), createReport);

router.route('/:id')
  .delete(protect, deleteReport);

router.route('/:id/status')
  .put(protect, updateReportStatus);

module.exports = router;
