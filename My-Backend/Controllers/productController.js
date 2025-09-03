const e = require('express');
const Product = require('../Models/MenuModel');

//Only the client can access this controller

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('restaurant', 'name partnerInfo');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.searchProducts = async (req, res) => {
    try{
        const { query } = req.query.q || '';
        const products = await Product.find({ title: { $regex: query, $options: 'i' } }).populate('restaurant', 'name partnerInfo');
        res.status(200).json(products);

    }catch(err){
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

exports.getProduct = async (req, res) => {
    try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    
    res.json(p);
    } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};