const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../Models/UserModel');
const Partner = require('../Models/PartnerModel');
const DeliveryAgent = require('../Models/deliveryAgentModel');

dotenv.config();

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '30d' 
  });
};

exports.register = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = req.body || {};
    const files = req.files || {};
    const role = (body.role || 'client').toLowerCase();

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.password || !body.address) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'all fields are required' });
    }

    //checks password match
    // if (body.password !== body.confirmPassword) {
    //   await session.abortTransaction();
    //   session.endSession();
    //   return res.status(400).json({ message: 'Passwords do not match' });
    // }

    if (role === 'admin') {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'Cannot register as admin' });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email: body.email }, { phone: body.phone }]
    }).session(session);

    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'user already exists with these info' });
    }

    // Create user document
    const userData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: body.password,
      role: role,
      address: body.address,
      verified: false
    };

    // Handle location
    if (body.lat && body.lng) {
      const lat = parseFloat(body.lat);
      const lng = parseFloat(body.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        userData.location = {
          type: 'Point',
          coordinates: [lng, lat]
        };
      }
    }

    const user = await User.create([userData], { session });
    let partner, deliveryAgent;

    // If role is partner, create Partner document
    if (role === 'partner') {
      if (!body.restaurantName  || !body.BankAccount || !body.description || !body.foodcategory || !body.restaurantLocation) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'all fields are required' });
      }

      const partnerData = {
        user: user[0]._id,
        restaurantName: body.restaurantName,
        description: body.description || '',
        address: body.address,
        categories: body.foodcategory ? 
          body.foodcategory.split(',').map(s => s.trim()).filter(Boolean) : [],
        approved: false
      };

      // Handle partner documents
      if (files.partnerDocs && files.partnerDocs.length > 0) {
        partnerData.documents = files.partnerDocs.map(file => file.path);
      }

      partner = await Partner.create([partnerData], { session });
    }

    // If role is delivery_agent, create DeliveryAgent document
    if (role === 'delivery_agent') {
      if (!body.vehicleType || !body.IDcard || !body.vehiclelicense) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: 'all fields are required for delivery agents' 
        });
      }

      // Validate restaurant exists
      if (body.restaurantId) {
      const restaurant = await Partner.findById(body.restaurantId).session(session);
      if (!restaurant) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Invalid restaurant ID' });
      }
    }

      const deliveryAgentData = {
        user: user[0]._id,
        restaurant: body.restaurantId || null,
        vehicleType: body.vehicleType,
        vehiclelicense: body.vehiclelicense,
        approved: false
      };

      // Handle delivery agent documents
      if (files.deliveryDocs && files.deliveryDocs.length > 0) {
        deliveryAgentData.documents = files.deliveryDocs.map(file => file.path);
      }

      deliveryAgent = await DeliveryAgent.create([deliveryAgentData], { session });
    }

    await session.commitTransaction();
    session.endSession();

    const token = signToken(user[0]._id, user[0].role);

    // Prepare response
    const responseData = {
      user: {
        id: user[0]._id,
        name: user[0].name,
        email: user[0].email,
        phone: user[0].phone,
        role: user[0].role
      },
      token
    };

    // Add role-specific data to response
    if (partner) {
      responseData.partner = {
        id: partner[0]._id,
        restaurantName: partner[0].restaurantName,
        needsApproval: !partner[0].approved
      };
    }

    if (deliveryAgent) {
      responseData.deliveryAgent = {
        id: deliveryAgent[0]._id,
        restaurant: deliveryAgent[0].restaurant
      };
    }

    return res.status(201).json(responseData);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For partners and delivery agents, fetch additional data
    let additionalData = {};
    if (user.role === 'partner') {
      const partner = await Partner.findOne({ user: user._id });
      if (partner) {
        additionalData.partner = {
          id: partner._id,
          restaurantName: partner.restaurantName,
          approved: partner.approved
        };
      }
    } else if (user.role === 'delivery_agent') {
      const deliveryAgent = await DeliveryAgent.findOne({ user: user._id })
        .populate('restaurant', 'restaurantName');
      if (deliveryAgent) {
        additionalData.deliveryAgent = {
          id: deliveryAgent._id,
          restaurant: deliveryAgent.restaurant,
          approved: deliveryAgent.approved
        };
      }
    }

    const token = signToken(user._id, user.role);
    
    res.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      ...additionalData,
      token 
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error' }); 
  }
};

exports.profile = async (req, res) => {
  try {
    // For partners and delivery agents, fetch additional data
    let additionalData = {};
    if (req.user.role === 'partner') {
      const partner = await Partner.findOne({ user: req.user._id });
      if (partner) {
        additionalData.partner = {
          id: partner._id,
          restaurantName: partner.restaurantName,
          description: partner.description,
          address: partner.address,
          categories: partner.categories,
          approved: partner.approved,
          documents: partner.documents
        };
      }
    } else if (req.user.role === 'delivery_agent') {
      const deliveryAgent = await DeliveryAgent.findOne({ user: req.user._id })
        .populate('restaurant', 'restaurantName address');
      if (deliveryAgent) {
        additionalData.deliveryAgent = {
          id: deliveryAgent._id,
          vehicleType: deliveryAgent.vehicleType,
          licenseNumber: deliveryAgent.licenseNumber,
          restaurant: deliveryAgent.restaurant,
          approved: deliveryAgent.approved,
          documents: deliveryAgent.documents
        };
      }
    }

    res.json({ 
      user: req.user,
      ...additionalData
    });
  } catch (err) {
    console.error('PROFILE ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.ResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.forgotPasswordCode = Otp;
    user.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    await user.save();

    // In a real application, send the OTP via email or SMS
    console.log(`OTP for ${email}: ${Otp}`);

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('RESET PASSWORD ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.VerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email }).select('+forgotPasswordCode +forgotPasswordExpiry');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.forgotPasswordCode || user.forgotPasswordCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.forgotPasswordExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    user.forgotPasswordCode = undefined;
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordCodeValidation = true;
    await user.save();

    const token = signToken(user._id, user.role);
    return res.status(200).json({ message: 'OTP verified successfully', token });
  } catch (err) {
    console.error('VERIFY OTP ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.SetNewPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.forgotPasswordCodeValidation) {
      return res.status(400).json({ message: 'OTP not verified' });
    }

    user.password = newPassword;
    user.forgotPasswordCodeValidation = false;
    user.forgotPasswordCode = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('SET NEW PASSWORD ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.LogOut = async (req, res) => {
  try {
    // In a token-based auth, logout is handled client-side by removing the token
    // This endpoint can be used for server-side token blacklisting if needed
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('LOGOUT ERROR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};