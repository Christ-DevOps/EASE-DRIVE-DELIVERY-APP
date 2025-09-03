// Routers/cartRouter.js
const express = require('express');
const router = express.Router();
const {protect, authorize} = require('../Middlewares/authMiddleWare');
const cartCtrl = require('../Controllers/cartController');

router.get('/', protect, cartCtrl.getCart);
router.post('/update', protect, cartCtrl.addToCart);
router.post('/remove', protect, cartCtrl.removeFromCart);
router.post('/clear', protect, cartCtrl.clearCart);

module.exports = router;
