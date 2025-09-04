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

// New endpoint to verify restaurant existence
exports.verifyRestaurant = async (req, res) => {
  try {
    const { restaurantName } = req.body;
    
    if (!restaurantName) {
      return res.status(400).json({ message: 'Restaurant name is required' });
    }

    // Search for restaurant by name (case-insensitive)
    const restaurant = await Partner.findOne({ 
      restaurantName: { $regex: new RegExp(restaurantName.trim(), 'i') },
      approved: true // Only verified restaurants
    });

    if (restaurant) {
      return res.status(200).json({ 
        exists: true, 
        restaurant: {
          id: restaurant._id,
          name: restaurant.restaurantName,
          address: restaurant.address
        }
      });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('RESTAURANT VERIFICATION ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const body = req.body || {};
    const files = req.files || {};
    const role = (body.role || 'client').toLowerCase();

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.password || !body.address) {
      return res.status(400).json({ message: 'all fields are required' });
    }

    if (role === 'admin') {
      return res.status(403).json({ message: 'Cannot register as admin' });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email: body.email }, { phone: body.phone }]
    });

    if (existingUser) {
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

    // Handle location (optional)
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

    // Create user (single document)
    const user = await User.create(userData);

    let partner = null;
    let deliveryAgent = null;

    // If role is partner, create Partner document
    if (role === 'partner') {
      if ( !body.BankAccount || !body.description || !body.foodcategory || !body.restaurantLocation) {
        await User.findByIdAndDelete(user._id).catch(() => {});
        return res.status(400).json({ message: 'all fields are required for partner' });
      }

      const partnerData = {
        user: user._id,
        restaurantName: userData.name,
        description: body.description || '',
        address: body.restaurantLocation || body.address,
        categories: body.foodcategory ?
          body.foodcategory.split(',').map(s => s.trim()).filter(Boolean) : [],
        bankAccount: body.BankAccount,
        approved: false
      };

      // Handle partner documents (multer/other)
      if (files.partnerDocs && files.partnerDocs.length > 0) {
        partnerData.documents = files.partnerDocs.map(file => file.path);
      }

      partner = await Partner.create(partnerData);
    }

    // If role is delivery_agent, create DeliveryAgent document
    if (role === 'delivery_agent') {
      if (!body.vehicleType || !body.vehiclelicense) {
        await User.findByIdAndDelete(user._id).catch(() => {});
        return res.status(400).json({
          message: 'Vehicle type and license number are required for delivery agents'
        });
      }

      let restaurantId = null;
      
      // Handle restaurant association (optional)
      if (body.restaurantName) {
        const restaurant = await Partner.findOne({
          restaurantName: { $regex: new RegExp(body.restaurantName.trim(), 'i') },
          approved: true
        });
        
        if (!restaurant) {
          await User.findByIdAndDelete(user._id).catch(() => {});
          return res.status(400).json({ 
            message: 'Restaurant not found or not approved. Please verify the restaurant name.' 
          });
        }
        
        restaurantId = restaurant._id;
      }

      const deliveryAgentData = {
        user: user._id,
        restaurant: restaurantId, // Can be null for independent drivers
        vehicleType: body.vehicleType,
        licenseNumber: body.vehiclelicense,
        approved: false
      };

      // Handle delivery agent documents
      if (files.deliveryDocs && files.deliveryDocs.length > 0) {
        deliveryAgentData.documents = files.deliveryDocs.map(file => file.path);
      }

      try {
        deliveryAgent = await DeliveryAgent.create(deliveryAgentData);
      } catch (error) {
        // If delivery agent creation fails, cleanup user
        await User.findByIdAndDelete(user._id).catch(() => {});
        throw error;
      }
    }

    const token = signToken(user._id, user.role);

    // Prepare response
    const responseData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    };

    if (partner) {
      responseData.partner = {
        id: partner._id,
        restaurantName: partner.restaurantName,
        needsApproval: !partner.approved
      };
    }

    if (deliveryAgent) {
      // Get restaurant info if associated
      let restaurantInfo = null;
      if (deliveryAgent.restaurant) {
        const restaurant = await Partner.findById(deliveryAgent.restaurant);
        restaurantInfo = restaurant ? {
          id: restaurant._id,
          name: restaurant.restaurantName
        } : null;
      }

      responseData.deliveryAgent = {
        id: deliveryAgent._id,
        restaurant: restaurantInfo,
        vehicleType: deliveryAgent.vehicleType,
        approved: deliveryAgent.approved,
        isIndependent: !deliveryAgent.restaurant
      };
    }

    return res.status(201).json(responseData);
  } catch (err) {
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
          description: partner.description,
          address: partner.address,
          categories: partner.categories,
          approved: partner.approved
        };
      }
    } else if (user.role === 'delivery_agent') {
      const deliveryAgent = await DeliveryAgent.findOne({ user: user._id })
        .populate('restaurant', 'restaurantName address');
      if (deliveryAgent) {
        additionalData.deliveryAgent = {
          id: deliveryAgent._id,
          vehicleType: deliveryAgent.vehicleType,
          licenseNumber: deliveryAgent.licenseNumber,
          restaurant: deliveryAgent.restaurant,
          approved: deliveryAgent.approved,
          isIndependent: !deliveryAgent.restaurant
        };
      }
    }

    const token = signToken(user._id, user.role);
    
    res.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
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
          documents: partner.documents,
          bankAccount: partner.bankAccount
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
          documents: deliveryAgent.documents,
          isIndependent: !deliveryAgent.restaurant
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

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;
    const files = req.files || {};

    // Update user basic info
    const userUpdates = {};
    if (updates.name) userUpdates.name = updates.name;
    if (updates.phone) userUpdates.phone = updates.phone;
    if (updates.address) userUpdates.address = updates.address;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(userId, userUpdates);
    }

    // Handle role-specific updates
    if (req.user.role === 'partner') {
      const partner = await Partner.findOne({ user: userId });
      if (partner) {
        const partnerUpdates = {};
        if (updates.restaurantName) partnerUpdates.restaurantName = updates.restaurantName;
        if (updates.description) partnerUpdates.description = updates.description;
        if (updates.restaurantLocation) partnerUpdates.address = updates.restaurantLocation;
        if (updates.foodcategory) {
          partnerUpdates.categories = updates.foodcategory.split(',').map(s => s.trim()).filter(Boolean);
        }

        // Handle new documents
        if (files.partnerDocs && files.partnerDocs.length > 0) {
          const newDocs = files.partnerDocs.map(file => file.path);
          partnerUpdates.documents = [...(partner.documents || []), ...newDocs];
        }

        if (Object.keys(partnerUpdates).length > 0) {
          await Partner.findByIdAndUpdate(partner._id, partnerUpdates);
        }
      }
    } else if (req.user.role === 'delivery_agent') {
      const deliveryAgent = await DeliveryAgent.findOne({ user: userId });
      if (deliveryAgent) {
        const agentUpdates = {};
        if (updates.vehicleType) agentUpdates.vehicleType = updates.vehicleType;
        if (updates.vehiclelicense) agentUpdates.licenseNumber = updates.vehiclelicense;

        // Handle restaurant association change
        if (updates.restaurantName !== undefined) {
          if (updates.restaurantName) {
            const restaurant = await Partner.findOne({
              restaurantName: { $regex: new RegExp(updates.restaurantName.trim(), 'i') },
              approved: true
            });
            if (!restaurant) {
              return res.status(400).json({ 
                message: 'Restaurant not found or not approved' 
              });
            }
            agentUpdates.restaurant = restaurant._id;
          } else {
            // Remove restaurant association (become independent)
            agentUpdates.restaurant = null;
          }
        }

        // Handle new documents
        if (files.deliveryDocs && files.deliveryDocs.length > 0) {
          const newDocs = files.deliveryDocs.map(file => file.path);
          agentUpdates.documents = [...(deliveryAgent.documents || []), ...newDocs];
        }

        if (Object.keys(agentUpdates).length > 0) {
          await DeliveryAgent.findByIdAndUpdate(deliveryAgent._id, agentUpdates);
        }
      }
    }

    // Return updated profile
    const updatedUser = await User.findById(userId);
    let additionalData = {};

    if (req.user.role === 'partner') {
      const partner = await Partner.findOne({ user: userId });
      if (partner) {
        additionalData.partner = {
          id: partner._id,
          restaurantName: partner.restaurantName,
          description: partner.description,
          address: partner.address,
          categories: partner.categories,
          approved: partner.approved
        };
      }
    } else if (req.user.role === 'delivery_agent') {
      const deliveryAgent = await DeliveryAgent.findOne({ user: userId })
        .populate('restaurant', 'restaurantName address');
      if (deliveryAgent) {
        additionalData.deliveryAgent = {
          id: deliveryAgent._id,
          vehicleType: deliveryAgent.vehicleType,
          licenseNumber: deliveryAgent.licenseNumber,
          restaurant: deliveryAgent.restaurant,
          approved: deliveryAgent.approved,
          isIndependent: !deliveryAgent.restaurant
        };
      }
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role
      },
      ...additionalData
    });
  } catch (err) {
    console.error('UPDATE PROFILE ERROR:', err);
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

    return res.status(200).json({ 
      message: 'OTP sent successfully',
      // Remove this in production
      otp: process.env.NODE_ENV === 'development' ? Otp : undefined
    });
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

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
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

// Additional utility functions
exports.getAllDeliveryAgents = async (req, res) => {
  try {
    const agents = await DeliveryAgent.find()
      .populate('user', 'name email phone address')
      .populate('restaurant', 'restaurantName address');
    
    res.json({
      agents: agents.map(agent => ({
        id: agent._id,
        user: agent.user,
        restaurant: agent.restaurant,
        vehicleType: agent.vehicleType,
        licenseNumber: agent.licenseNumber,
        approved: agent.approved,
        isIndependent: !agent.restaurant,
        createdAt: agent.createdAt
      }))
    });
  } catch (err) {
    console.error('GET DELIVERY AGENTS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveDeliveryAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { approved } = req.body;

    const deliveryAgent = await DeliveryAgent.findByIdAndUpdate(
      agentId,
      { approved: approved },
      { new: true }
    ).populate('user', 'name email');

    if (!deliveryAgent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }

    res.json({
      message: `Delivery agent ${approved ? 'approved' : 'rejected'} successfully`,
      agent: deliveryAgent
    });
  } catch (err) {
    console.error('APPROVE DELIVERY AGENT ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approvePartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { approved } = req.body;

    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      { approved: approved },
      { new: true }
    ).populate('user', 'name email');
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json({
      message: `Partner ${approved ? 'approved' : 'rejected'} successfully`,
      partner: partner
    });
  } catch (err) {
    console.error('APPROVE PARTNER ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
}