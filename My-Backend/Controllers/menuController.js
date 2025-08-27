// controllers/menuController.js
const Menu = require('../Models/MenuModel');
const User = require('../Models/UserModel');

/**
 * Create menu (partner only)
 * POST /api/menus
 * body: { title, price, description?, category? } + optional file 'image'
 */
exports.createMenu = async (req, res) => {
  try {
    // req.user from protect middleware (ensure partner role via authorize)
    const partner = req.user;
    if(!req.body){
      return res.status(400).json({ message: 'No data provided' });
    }
    const { title, price, description = 'Cameroon Delicious Meals', category = 'Local Meals', } = req.body;
    if (!title || !price) return res.status(400).json({ message: 'All fields are required' });

    const menuData = {
      title,
      price: Number(price),
      description,
      category,
      restaurant: partner._id,
      restaurantName: partner.name || partner.partnerInfo?.companyName || ''
    };

    if (req.file) {
      // image path - you might want to expose as /uploads/...
      menuData.image = `/uploads/menus/${req.file.filename}`;
    }

    const menu = await Menu.create(menuData);

    // optional: push to user's menus array if you added it
    if (Array.isArray(partner.menus)) {
      partner.menus.push(menu._id);
      await partner.save();
    }

    return res.status(201).json({ message: 'Menu created', menu });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Get all menus for a partner
 * GET /api/menus/my
 */
exports.getMenus = async (req, res) => {
  try {
    const partnerId = req.user._id;
    const menus = await Menu.find({ restaurant: partnerId }).sort({ createdAt: -1 });
    return res.json({ menus });
  } catch (err) {
    console.error(err); 
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get single menu by id (public)
 * GET /api/menus/:id
 */
exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate('restaurant', 'name email partnerInfo');
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    return res.json({ menu });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update menu (partner only, must own)
 * PUT /api/menus/:id
 */
exports.updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });

    // only owner can update
    if (!menu.restaurant.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { title, description, price, category } = req.body;
    if (title !== undefined) menu.title = title;
    if (description !== undefined) menu.description = description;
    if (price !== undefined) menu.price = Number(price);
    if (category !== undefined) menu.category = category;
    if (req.file) menu.image = `/uploads/menus/${req.file.filename}`;

    await menu.save();
    return res.json({ message: 'Menu updated', menu });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete menu (partner only, must own)
 * DELETE /api/menus/:id
 */
exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });

    if (!menu.restaurant.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if(Array.isArray(req.user.menus)){
      req.user.menus = req.user.menus.filter(mId => !mId.equals(menu._id));
      await req.user.save();
    }

    await menu.deleteOne();
    req.user.save();

    return res.json({ message: 'Menu deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Public: list menus (search, pagination)
 * GET /api/menus?category=&q=&page=&limit=
 */
exports.listMenus = async (req, res) => {
  try {
    const { category, q, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.$or = [
      { title: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
      { restaurantName: new RegExp(q, 'i') }
    ];

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const [menus, total] = await Promise.all([
      Menu.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Menu.countDocuments(filter)
    ]);

    return res.json({
      menus,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
