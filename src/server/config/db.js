const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables.');
    }
    // Mongoose 6+ no longer requires deprecated options like useNewUrlParser
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Automatically sync indexes to handle any index changes or conflicts on existing collections
    const Job = require('../models/Job');
    const User = require('../models/User');
    const Application = require('../models/Application');
    await Promise.all([
      User.syncIndexes().catch(() => {}),
      Job.syncIndexes().catch(() => {}),
      Application.syncIndexes().catch(() => {})
    ]);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
