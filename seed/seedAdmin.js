const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/user_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const runSeed = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@purplemerit.com' });
    
    if (adminExists) {
      console.log('Admin user already exists. Seed process skipped.');
      process.exit();
    }

    const users = [
      {
        name: 'System Admin',
        email: 'admin@purplemerit.com',
        password: 'Admin@123',
        role: 'admin',
        isActive: true
      },
      {
        name: 'System Manager',
        email: 'manager@purplemerit.com',
        password: 'Manager@123',
        role: 'manager',
        isActive: true
      },
      {
        name: 'Standard User',
        email: 'user@purplemerit.com',
        password: 'User@123',
        role: 'user',
        isActive: true
      }
    ];

    await User.create(users);

    console.log('Database seeded successfully with initial users.');
    process.exit();
  } catch (error) {
    console.error(`Data Import Error: ${error.message}`);
    process.exit(1);
  }
};

runSeed();
