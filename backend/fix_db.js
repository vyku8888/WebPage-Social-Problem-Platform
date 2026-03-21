const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      await mongoose.connection.collection('votes').dropIndex('user_1_solution_1');
      console.log('Dropped user_1_solution_1 index.');
    } catch(err) {
      console.log('Index user_1_solution_1 might already be dropped: ', err.message);
    }
    try {
      await mongoose.connection.collection('votes').dropIndex('user_1_issue_1');
      console.log('Dropped user_1_issue_1 index.');
    } catch(err) {
      console.log('Index user_1_issue_1 might already be dropped: ', err.message);
    }
    process.exit(0);
  });
