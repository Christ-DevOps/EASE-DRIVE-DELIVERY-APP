// Models/OrderModel.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true }, // price snapshot
  image: {type: [String], default: null}, // store file path or URL
  name: { type: String }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAgent' },   // delivery agent (optional)
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' }, // merchant (optional)

  items: { type: [OrderItemSchema], default: [] },

  subtotal: { type: Number, default: 0 },     // sum(price * qty)
  totalItems: { type: Number, default: 0 },   // number of items (sum of quantities)
  deliveryFee: { type: Number, default: 1000 },  // numeric, e.g. 1000 or 1.5 depending on your currency
  total: { type: Number, default: 0 },        // subtotal + deliveryFee
  paid: { type: Boolean, default: false },
  // order state
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'picked_up'],
    default: 'pending'
  },
  deliveryAddress: { type: String, required: true },
  deliveryLocation: { // GeoJSON Point: { type: 'Point', coordinates: [lng, lat] }
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  createdAt: { type: Date, default: Date.now },
  instructions: { type: String },

}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Order', OrderSchema);
