const Order = require('../Models/OrderModel');
const Cart = require('../Models/CartModel');
const Menu = require('../Models/MenuModel');

// Create order from cart (checkout) — uses session (transaction) to be safer
exports.checkout = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // load cart
    const cart = await Cart.findOne({ user: req.user._id }).session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Optionally validate stock and decrement
    for (const it of cart.items) {
      const product = await Product.findById(it.product).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Product ${it.name} not found` });
      }
      if (product.stock != null && product.stock < it.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      if (product.stock != null) {
        product.stock = product.stock - it.quantity;
        await product.save({ session });
      }
    }

    // compute totals
    const subtotal = cart.items.reduce((s, it) => s + (it.price * it.quantity), 0);
    const deliveryFee = Number(req.body.deliveryFee || 0);
    const total = subtotal + deliveryFee;

    const order = await Order.create([{
      user: req.user._id,
      items: cart.items.map(i => ({ product: i.product, name: i.name, price: i.price, quantity: i.quantity })),
      subtotal,
      deliveryFee,
      total,
      address: req.body.address || '',
      phone: req.body.phone || req.user?.phone,
      paymentMethod: req.body.paymentMethod || 'cash'
    }], { session });

    // Clear cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ order: order[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('checkout error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get orders for current user (customers) or all for admin
exports.getMyOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') filter.user = req.user._id;
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('getMyOrders', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single order (customer may view only own order)
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    console.error('getOrder', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (role restricted)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    // Admin can update all; delivery_agent can set 'out_for_delivery' and 'delivered' on assigned orders
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role === 'delivery_agent') {
      if (order.assignedTo?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not assigned to you' });
      }
      // allow only certain transitions
      if (!['out_for_delivery','delivered'].includes(status)) return res.status(403).json({ message: 'Not allowed' });
    }

    order.status = status;
    order.updatedAt = Date.now();
    if (req.body.assignedTo && req.user.role === 'admin') order.assignedTo = req.body.assignedTo;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error('updateOrderStatus', err);
    res.status(500).json({ message: 'Server error' });
  }
};
