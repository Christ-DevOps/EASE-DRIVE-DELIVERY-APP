// Routers/orderRouter.js
const express = require('express');
const router = express.Router();
const {protect, } = require('../Middlewares/authMiddleWare');
const authorize = require('../Middlewares/roleMiddleWare');
const orderCtrl = require('../Controllers/orderController');

router.post('/checkout', protect, orderCtrl.checkout);
router.get('/me', protect, orderCtrl.getMyOrders);
router.get('/:id', protect, orderCtrl.getOrder);
router.patch('/:id/status', protect, authorize('admin','delivery_agent'), orderCtrl.updateOrderStatus);

module.exports = router;
