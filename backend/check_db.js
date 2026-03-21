const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const users = await User.find({}, 'name email credits score issuesReported totalVotesReceived');
      console.log('USERS:', users);
    } catch(err) {
      console.log('Error:', err.message);
    }
    process.exit(0);
  });
