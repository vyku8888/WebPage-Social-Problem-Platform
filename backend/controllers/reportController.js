const Report = require('../models/Report');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('reporter', 'name').sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  const { title, category, location, description, severity, isAnonymous } = req.body;
  let imageUrl = '';

  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else {
    return res.status(400).json({ message: 'Image is required for reporting' });
  }

  try {
    const report = new Report({
      title,
      category,
      location,
      description,
      severity,
      imageUrl,
      reporter: req.user._id,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
    });
    const createdReport = await report.save();
    
    // Reward logic: treated essentially identically to issue reporting for this platform
    await User.findByIdAndUpdate(req.user._id, { $inc: { credits: 10, score: 5, issuesReported: 1 } });

    res.status(201).json(createdReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Verify ownership
    if (report.reporter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this report' });
    }

    // Delete image from FS
    if (report.imageUrl) {
      const imagePath = path.join(__dirname, '..', report.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Report.findByIdAndDelete(req.params.id);
    
    // Reverse credits cleanly without setting negative
    const reporter = await User.findById(req.user._id);
    if (reporter) {
      reporter.credits = Math.max(0, (reporter.credits || 0) - 10);
      reporter.score = Math.max(0, (reporter.score || 0) - 5);
      reporter.issuesReported = Math.max(0, (reporter.issuesReported || 0) - 1);
      await reporter.save();
    }

    res.json({ message: 'Report removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status
// @route   PUT /api/reports/:id/status
// @access  Private
const updateReportStatus = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (report.reporter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this report' });
    }

    report.status = req.body.status || 'Action Taken';
    const updatedReport = await report.save();
    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReports, createReport, deleteReport, updateReportStatus };
