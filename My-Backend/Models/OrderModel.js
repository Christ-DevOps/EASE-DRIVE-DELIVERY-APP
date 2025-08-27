const { required, boolean } = require('joi');
const mongoose = require('mongoose');

const OrderModel = mongoose.Schema({
    ClientRef:{

    },
    PartnerRef:{

    },
    amount: {
        type: Float16Array,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    deliveryAddress:{
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", OrderModel)