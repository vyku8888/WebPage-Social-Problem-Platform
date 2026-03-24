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
    imageUrl = req.file.path;
  } else {
    return res.status(400).json({ message: 'Image is required for reporting' });
  }

  // --- HUGGING FACE AI IMAGE VERIFICATION ---
  try {
    const imgRes = await fetch(imageUrl);
    const imgBuffer = await imgRes.arrayBuffer();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second max wait for demo speed constraints

    const hfRes = await fetch("https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large", {
      headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      method: "POST",
      body: Buffer.from(imgBuffer),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const hfData = await hfRes.json();
    
    // Check if the AI returned a clear caption
    if (Array.isArray(hfData) && hfData[0] && hfData[0].generated_text) {
      const caption = hfData[0].generated_text.toLowerCase();
      
      // Master list of allowed social problem identifiers
      const validKeywords = [
        'garbage', 'trash', 'waste', 'dump', 'litter', 'plastic', 'bottle', 'bag',
        'road', 'street', 'pothole', 'crack', 'asphalt', 'hole', 'damage', 'broken',
        'water', 'pipe', 'leak', 'flood', 'drain', 'sewer', 'puddle', 
        'pole', 'wire', 'cable', 'electricity', 'light', 'sign', 'fence', 'wall',
        'dirt', 'mud', 'spill', 'debris', 'hazard', 'ruin', 'abandoned', 'mess', 'clutter', 'plant', 'tree', 'graffiti', 'paint', 'fire'
      ];
      
      const isRelevant = validKeywords.some(kw => caption.includes(kw));
      
      // If the image is a picture of a cute puppy or a selfie, blast it!
      if (!isRelevant) {
        return res.status(400).json({ 
          message: `AI Scanner Rejected: Image appears to be "${caption}". This is not recognized as valid community hazard evidence.` 
        });
      }
    }
  } catch (error) {
    console.error("AI Scanner Error or Timeout, allowing submission to proceed:", error.message);
  }
  // ------------------------------------------

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
