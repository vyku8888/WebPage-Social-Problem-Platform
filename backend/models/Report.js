const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  imageUrl: { type: String, required: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Action Taken'], default: 'Pending' },
  isAnonymous: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
