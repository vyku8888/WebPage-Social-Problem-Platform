const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalVotes: { type: Number, default: 0 },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
