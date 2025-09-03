const express = require('express');
const router = express.Router();
const productCtrl = require('../Controllers/productController');
const protect = require('../Middlewares/authMiddleWare');
const authorize = require('../Middlewares/roleMiddleWare');

router.post('/search', productCtrl.searchProducts);
router.get('/', productCtrl.getAllProducts);
router.get('/:id', productCtrl.getProduct);

module.exports = router;
