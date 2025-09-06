const express = require('express');
const partnerCtrl = require('../Controllers/partnerController');
const auth = require('../Middlewares/validate')
const router = express.Router();

// POST /api/partners/check-exists
router.post('/check-exists', partnerCtrl.checkPartnerExists);
router.get('/pending',auth.validatePartner, partnerCtrl.getPendingRequests);
router.put('/approve/:id', auth.validatePartner, partnerCtrl.approveRequest);
router.delete('/reject/:id', auth.validatePartner, partnerCtrl.rejectRequest);

module.exports = router;
