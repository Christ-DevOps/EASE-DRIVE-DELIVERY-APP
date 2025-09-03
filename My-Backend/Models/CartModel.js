const mongoose = require('mongoose');
// const { use } = require('react');

const CartItemSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true }, // price at the time of adding to cart
    image: [String], // store file path or URL
    name: { type: String}
}, { _id: false });

const CartSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [CartItemSchema],
    totalPrice: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
    
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
