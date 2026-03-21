const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
  solution: { type: mongoose.Schema.Types.ObjectId, ref: 'Solution' }
}, { timestamps: true });

// Uniqueness is strictly enforced at the controller application-level.

module.exports = mongoose.model('Vote', voteSchema);
