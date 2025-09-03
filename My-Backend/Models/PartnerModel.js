const { required, boolean } = require('joi');
const mongoose = require('mongoose');

const Partnerschema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantName: {
        type: String,
        required: true
    },
    restaurantLocation: {
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
    category: {
        type: [String],
        required: true
    },
    Description:{
        type: String,
        required: true
    },
    documents: {
        type: [String]
    }, 
    approved: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.5
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    Logistics: {
        type: Boolean,
        required: true
    },
    BankAccount:{
        type: String,
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

// Indexes for geospatial and text search
Partnerschema.index({ location: '2dsphere' });
Partnerschema.index({ restaurantName: 'text', description: 'text' });
Partnerschema.index({ user: 1 });

module.exports = mongoose.model("Partner", Partnerschema);