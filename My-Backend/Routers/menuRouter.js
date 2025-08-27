const express = require('express');
const router = express.Router();
const menuCtrl = require('../Controllers/menuController');
const { protect, authorize } = require('../Middlewares/authMiddleWare');
const { route } = require('./authRouter');
const upload = require('../Middlewares/uploadMiddleWare');

router.use(protect); // all routes are protected and require authentication

//here are the different partner routes
router.post('/Addmenu', authorize('partner'),upload.single('image'),  menuCtrl.createMenu);
router.get('/mymenus', authorize('partner'), menuCtrl.getMenus);
router.put('/updatemenu/:id', authorize('partner'), upload.single('image'), menuCtrl.updateMenu);
router.delete('/deletemenu/:id', authorize('partner'), menuCtrl.deleteMenu);

//these are the public routes that don't require authentication
router.get('/Allmenus', menuCtrl.listMenus);    
router.get('/menu/:id', menuCtrl.getMenu);

module.exports = router;
