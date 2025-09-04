// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authCtrl = require('../Controllers/authController');
const upload = require('../Middlewares/uploadMiddleWare'); // Assuming you have a middleware for file uploads

// Use multer if you want file uploads (partner/delivery docs) as described earlier
// const upload = require('../middleware/upload');
// router.post('/register', upload.fields([{ name: 'partnerDocs' }, { name: 'deliveryDocs' }]), authCtrl.register);

router.post('/register',upload.fields([
    { name: 'partnerDocs', maxCount: 5 },
    { name: 'deliveryDocs', maxCount: 5 }
  ]), authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/resetPassword', authCtrl.ResetPassword);
router.post('/verification', authCtrl.VerifyOtp);
router.post('/SetPassword', authCtrl.SetNewPassword);
router.post('/restaurants/verify', authCtrl.verifyRestaurant);

//profile
// router.get('/profile', require('../Middlewares/authMiddleWare').protect, authCtrl.profile);
// router.put('/profile', require('../Middlewares/authMiddleWare').proteft, authCtrl.updateProfile);

//approve partner and delivery agent
router.patch('/partner/:id/approve', require('../Middlewares/authMiddleWare').protect, require('../Middlewares/roleMiddleWare')('admin'), authCtrl.approvePartner);
router.patch('/delivery/:id/approve', require('../Middlewares/authMiddleWare').protect, require('../Middlewares/roleMiddleWare')('admin'), authCtrl.approveDeliveryAgent);

// router.get('/profile', require('../Middlewares/authMiddleWare'), authCtrl.profile);

module.exports = router;
