// seeder/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../Models/UserModel');

(async () => {
  try {
    await connectDB();
    const adminEmail = 'tangomochrist@gmail.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Christ',
        email: adminEmail,
        address: 'Awae, Escalier',
        phone:"1234567890",
        password: 'Christ237', // will be hashed
        role: 'admin'
      });
      console.log('✅ Admin created:', adminEmail);
    } else {
      console.log('ℹ️ Admin already exists');
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
