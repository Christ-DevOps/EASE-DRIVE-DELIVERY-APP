// controllers/adminController.js
const User = require('../Models/UserModel');
const Partner = require('../Models/PartnerModel');
const DeliveryAgent = require('../Models/DeliveryModel');

// Get all pending partner registrations
exports.getPendingPartners = async (req, res) => {
  try {
    const pendingPartners = await Partner.find({ approved: false })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.status(200).json(pendingPartners);
  } catch (error) {
    console.error('Error fetching pending partners:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all pending delivery agent registrations
exports.getPendingDeliveryAgents = async (req, res) => {
  try {
    const pendingAgents = await DeliveryAgent.find({ approved: false })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.status(200).json(pendingAgents);
  } catch (error) {
    console.error('Error fetching pending delivery agents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve a partner registration
exports.approvePartner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const partner = await Partner.findByIdAndUpdate(
      id,
      { approved: true, approvedAt: new Date() },
      { new: true }
    ).populate('user');
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    // Update user status as well
    await User.findByIdAndUpdate(partner.user._id, { verified: true });
    
    res.status(200).json({ message: 'Partner approved successfully', partner });
  } catch (error) {
    console.error('Error approving partner:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject a partner registration
exports.rejectPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const partner = await Partner.findByIdAndUpdate(
      id,
      { 
        approved: false, 
        rejectionReason: reason || 'No reason provided',
        rejectedAt: new Date() 
      },
      { new: true }
    ).populate('user');
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    res.status(200).json({ message: 'Partner rejected successfully', partner });
  } catch (error) {
    console.error('Error rejecting partner:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve a delivery agent registration
exports.approveDeliveryAgent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const agent = await DeliveryAgent.findByIdAndUpdate(
      id,
      { approved: true, approvedAt: new Date() },
      { new: true }
    ).populate('user');
    
    if (!agent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }
    
    // Update user status as well
    await User.findByIdAndUpdate(agent.user._id, { verified: true });
    
    res.status(200).json({ message: 'Delivery agent approved successfully', agent });
  } catch (error) {
    console.error('Error approving delivery agent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject a delivery agent registration
exports.rejectDeliveryAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const agent = await DeliveryAgent.findByIdAndUpdate(
      id,
      { 
        approved: false, 
        rejectionReason: reason || 'No reason provided',
        rejectedAt: new Date() 
      },
      { new: true }
    ).populate('user');
    
    if (!agent) {
      return res.status(404).json({ message: 'Delivery agent not found' });
    }
    
    res.status(200).json({ message: 'Delivery agent rejected successfully', agent });
  } catch (error) {
    console.error('Error rejecting delivery agent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get statistics for admin dashboard
exports.getRegistrationStats = async (req, res) => {
  try {
    const pendingPartners = await Partner.countDocuments({ approved: false });
    const pendingAgents = await DeliveryAgent.countDocuments({ approved: false });
    const totalPartners = await Partner.countDocuments();
    const totalAgents = await DeliveryAgent.countDocuments();
    
    res.status(200).json({
      pendingPartners,
      pendingAgents,
      totalPartners,
      totalAgents
    });
  } catch (error) {
    console.error('Error fetching registration stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};