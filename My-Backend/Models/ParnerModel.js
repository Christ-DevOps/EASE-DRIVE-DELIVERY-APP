const { required, boolean } = require('joi');
const mongoose = require('mongoose');

const PartnerModel = mongoose.Schema({
    logoUrl: {
        type: String,
        required: true,
    },
    Location: {
        type: String,
        required: true
    },
    cuisineType: {
        type: String || Array,
        enum: ['Italian', 'Bulu', 'Bamileke', 'Sawa','Vegan']
    }, 
    Description:{
        type: String,
        required: true
    },
    Logistics: {
        type: boolean,
        required: true
    },
    BankAccount:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Partner", PartnerModel)