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