const mongoose = require('mongoose');

const MenuSchema = mongoose.Schema({
    title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, default: 'Local Meals' },
  image: { type: String, default: '' }, // store file path or URL
  rating: { type: Number, default: 4 },
  // restaurantName: { type: String, default: '' }, // convenience
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // partner id
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Menu', MenuSchema);