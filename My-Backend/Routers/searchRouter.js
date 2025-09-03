const express = require('express');
const router = express.Router();
const searchCtrl = require('../Controllers/searchController');

router.get('/FilterRestaurants', searchCtrl.filterRestaurants);
router.get('/FilterMenus', searchCtrl.filterMenu);
router.get('/find', searchCtrl.unifiedSearch);

module.exports = router;