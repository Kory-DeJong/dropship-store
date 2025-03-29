// backend/seedAdmin.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/userModel');

// Debug to check if environment variables are loaded
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Defined' : 'Undefined');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@yourstore.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user (password will be hashed by the pre-save middleware)
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@yourstore.com',
      password: 'securepassword123', // This will be automatically hashed
      isAdmin: true
    });
    
    console.log('Admin user created successfully:');
    console.log(`- Name: ${adminUser.name}`);
    console.log(`- Email: ${adminUser.email}`);
    console.log('- Password: securepassword123');
    console.log('\nIMPORTANT: Change this password immediately after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
