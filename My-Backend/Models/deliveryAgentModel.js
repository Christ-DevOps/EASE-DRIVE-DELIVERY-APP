const { required } = require('joi');
const mongoose = require('mongoose');

const DeliveryAgentModel = mongoose.Schema({
    vehicleType:{ 
        type: String,
        required: true,
    },
    DrivingLicense: {
        type: String,
        required: true
    },
    Availability:{
        type: String,
        enum: ['Available', 'Unavailable'],
    },
    BankAccountNumber: {
        type: String,
        required: false
    },
    Personalphoto: {
        type: String,
        required: true,
    },
    IdCardNumber:{
        type: String,
        required: true
    },
    IdCardImage:{
        type: String,
        required: true
    }

}, {
    timestampes: true
});

module.exports = mongoose.model("DeliveryAgent", DeliveryAgentModel);