const Issue = require('../models/Issue');
const Report = require('../models/Report');

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Public
const getAnalytics = async (req, res) => {
  try {
    const issues = await Issue.find();
    const reports = await Report.find();

    // 1. Category Distribution (Pie Chart)
    const categoryCount = {};
    issues.forEach(issue => {
      categoryCount[issue.category] = (categoryCount[issue.category] || 0) + 1;
    });
    reports.forEach(report => {
      categoryCount[report.category] = (categoryCount[report.category] || 0) + 1;
    });

    const categoryDistribution = Object.keys(categoryCount).map(key => ({
      name: key,
      value: categoryCount[key]
    }));

    // 2. Most Reported Problems (Bar Chart)
    const topIssues = await Issue.find().sort({ totalVotes: -1 }).limit(5).select('title totalVotes');
    const mostReported = topIssues.map(issue => ({
      name: issue.title.length > 15 ? issue.title.substring(0, 15) + '...' : issue.title,
      votes: issue.totalVotes
    }));

    // 3. Reports over time (Line Graph)
    const reportsOverTime = await Report.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 10 }
    ]);
    const timelineData = reportsOverTime.map(r => ({
      date: r._id,
      reports: r.count
    }));

    // 4. Rank issues (Score = votes)
    const rankedIssues = await Issue.find().populate('author', 'name').sort({ totalVotes: -1 }).limit(10);

    res.json({
      categoryDistribution,
      mostReported,
      timelineData,
      rankedIssues,
      totalIssues: issues.length,
      totalReports: reports.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
