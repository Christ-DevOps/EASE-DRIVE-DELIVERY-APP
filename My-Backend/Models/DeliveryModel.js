const { required, boolean, date } = require('joi');
const mongoose = require('mongoose');

const DeliberyModel = mongoose.Schema({
    OrderRef:{

    },
    DeliveryAgentRef:{

    },
    pickupTime:{
        type: date,
        required: false
    },
    status: {
        type: String,
        enum: ['In-transit', 'Delivered', 'Received'],
    },
    DeliveryAddress: {
        type: String,   
    }
})