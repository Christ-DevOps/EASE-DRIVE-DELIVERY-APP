const { required } = require("joi");
const mongoose = require("mongoose");


const MenuSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, "Title required"]
    },
    Price:{
        type: Number,
        required: [true, "Price is required"],

    },
    imgUrl:{
        type: String,
        required: true
    },
    Menutype:{
        type: String,
        required: [true, "Menu type is required"],
        enum: ['LocalMeals', 'FastFood', 'Drinks', 'Patisserie','Others']
    },
    description:{
        type: String,
        required: [true, "Description is required"],
    },
    RestaurantID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Menu", MenuSchema);