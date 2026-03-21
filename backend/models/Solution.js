const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
  votes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Solution', solutionSchema);
