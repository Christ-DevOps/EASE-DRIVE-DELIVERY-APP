const mongoose = require('mongoose');

const MenuSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: [ String ],
  image: [String], // store file path or URL
  rating: { type: Number, default: 4 },
  // restaurantName: { type: String, default: '' }, // convenience
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // partner id
  createdAt: { type: Date, default: Date.now }
});


//Text index for name + description for fast searching
MenuSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Menu', MenuSchema);