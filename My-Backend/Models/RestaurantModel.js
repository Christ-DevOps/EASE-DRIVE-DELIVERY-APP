const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  address: String,
  // GeoJSON point: [lng, lat]
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // user with 'partner' role
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: false } // [lng, lat]
  },
  photo: [String], // main photo URL
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },   // average rating
  ratingCount: { type: Number, default: 0 },
  categories: [String], // e.g. ['fast-food','burgers']
  createdAt: { type: Date, default: Date.now }
});

// 2dsphere index needed for geo queries
restaurantSchema.index({ location: '2dsphere' });

// text index for name + description
restaurantSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
