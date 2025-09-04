// Models/DeliveryAgentModel.js
const mongoose = require('mongoose');

const deliveryAgentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  //documents
  documents: {
    type:[ String]
  },
  IDcard: {
    type: String,
  },
  vehicleType:{
    type: String,
    default: 'Motor-Bike'
  },
  vehicleLicense:{
    type: String
  },
    // GeoJSON Point: { type: 'Point', coordinates: [lng, lat] }
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  availabilityStatus: {
    type: String,
    enum: ['available', 'offline'],
    default: 'available'
  },
  currentOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 20,
    default: 4.5
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  restaurantID: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null
  },
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for geospatial queries
deliveryAgentSchema.index({ currentLocation: '2dsphere' });
deliveryAgentSchema.index({ user: 1 });
deliveryAgentSchema.index({ availabilityStatus: 1 });
deliveryAgentSchema.index({ approved: 1 });

module.exports = mongoose.model('DeliveryAgent', deliveryAgentSchema);