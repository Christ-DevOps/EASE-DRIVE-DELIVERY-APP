// routes/admin.js
const express = require('express');
const router = express.Router();
const {
  getPendingPartners,
  getPendingDeliveryAgents,
  approvePartner,
  rejectPartner,
  approveDeliveryAgent,
  rejectDeliveryAgent,
  getRegistrationStats
} = require('../Controllers/adminController');
const { auth, admin } = require('../middleware/auth');

// All routes require authentication and admin privileges
router.use(auth, admin);

// Get registration statistics
router.get('/stats', getRegistrationStats);

// Partner routes
router.get('/partners/pending', getPendingPartners);
router.patch('/partners/:id/approve', approvePartner);
router.patch('/partners/:id/reject', rejectPartner);

// Delivery agent routes
router.get('/delivery-agents/pending', getPendingDeliveryAgents);
router.patch('/delivery-agents/:id/approve', approveDeliveryAgent);
router.patch('/delivery-agents/:id/reject', rejectDeliveryAgent);

module.exports = router;