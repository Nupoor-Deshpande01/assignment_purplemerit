const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // Utilize an in-memory instance only if no native URI is provided (for local dev dev/simplicity)
    if (!uri || uri === 'mongodb://localhost:27017/user_management') {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        console.log('MongoDB Memory Server explicitly injected at', uri);
      } catch (e) {
        console.log('Memory server dependency missing, falling back to original URI.');
      }
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    try {
      // Autoseed environment for Memory Configurations explicitly
      const User = require('../models/User');
      if ((await User.countDocuments()) === 0) {
        console.log('Bootstrapping database with test users...');
        await User.create([
          { name: 'System Admin', email: 'admin@purplemerit.com', password: 'Admin@123', role: 'admin', isActive: true },
          { name: 'System Manager', email: 'manager@purplemerit.com', password: 'Manager@123', role: 'manager', isActive: true },
          { name: 'Standard User', email: 'user@purplemerit.com', password: 'User@123', role: 'user', isActive: true }
        ]);
        console.log('Initial accounts successfully populated.');
      }
    } catch(err) {
      console.log(err);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
