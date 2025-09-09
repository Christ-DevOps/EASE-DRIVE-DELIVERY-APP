const { required, boolean, date } = require('joi');
const mongoose = require('mongoose');

const DeliverySchema = mongoose.Schema({
    Order:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true
    },
    DeliveryAgent:{
        type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAgent', required: true
    },
    Partner:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true
    },
    deliveryLocation: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    pickedupAt: {
        type: Date,
        required: false
    },
    deliveredAt: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        enum: ['In-transit', 'Delivered', 'Received'],
    },
    DeliveryAddress: {
        type: String,   
    }
});

// Indexes for geospatial queries
DeliverySchema.index({ deliveryLocation: '2dsphere' });
DeliverySchema.index({ User: 1 });
DeliverySchema.index({ Order: 1 });
DeliverySchema.index({ DeliveryAgent: 1 });
DeliverySchema.index({ Partner: 1 });
DeliverySchema.index({ status: 1 });


exports = mongoose.model("Delivery", DeliverySchema);