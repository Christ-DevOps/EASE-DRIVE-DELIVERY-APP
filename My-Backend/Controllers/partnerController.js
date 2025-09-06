const express = require('express');
const Partner = require('../Models/PartnerModel'); // Adjust path to your Partner model

/**
 * Check if a restaurant/partner exists by name
 * POST /api/partners/check-exists
 */
exports.checkPartnerExists = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant name is required'
      });
    }

    // Search for partner by name (case-insensitive)
    const partner = await Partner.findOne({
      name: { $regex: new RegExp(name.trim(), 'i') },
      status: 'active' // Only check active restaurants
    }).select('_id name email address phone');

    if (partner) {
      return res.status(200).json({
        success: true,
        exists: true,
        partner: {
          _id: partner._id,
          name: partner.name,
          email: partner.email,
          address: partner.address,
          phone: partner.phone
        }
      });
    } else {
      return res.status(200).json({
        success: true,
        exists: false,
        partner: null
      });
    }

  } catch (error) {
    console.error('Partner check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking restaurant',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Approve a partner request
exports.approveRequest = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (!partner) {
            return res.status(404).json({ message: 'Request not found' });
        }

        partner.approved = true;
        await partner.save();
        res.json({ message: 'Partner approved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPendingRequests = async (req, res) => {
    try {
        const { search, status } = req.query;
        const query = { approved: false };

        if (status && status !== 'all') {
            query.type = status; // Assuming type field is added to Partner model
        }

        if (search) {
            query.$or = [
                { restaurantName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'user.email': { $regex: search, $options: 'i' } }, // Assuming user has email
            ];
        }

        const requests = await Partner.find(query).populate('user', 'email phone');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Reject a partner request
exports.rejectRequest = async (req, res) => {
    try {
        const partner = await Partner.findById(req.params.id);
        if (!partner) {
            return res.status(404).json({ message: 'Request not found' });
        }

        await partner.remove();
        res.json({ message: 'Partner request rejected' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

