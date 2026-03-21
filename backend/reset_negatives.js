const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const result = await User.updateMany(
        { $or: [{ credits: { $lt: 0 } }, { score: { $lt: 0 } }] },
        { $set: { credits: 0, score: 0, totalVotesReceived: 0, issuesReported: 0 } }
      );
      console.log(`Successfully reset negative credits and scores for ${result.modifiedCount} users.`);
    } catch(err) {
      console.log('Error:', err.message);
    }
    process.exit(0);
  });
