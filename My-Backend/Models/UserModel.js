const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ------------------- Nested Schemas -------------------
const PartnerSchema = mongoose.Schema({
    foodcategory: [String],
    documents: [String],
    description: String,
    approved: { type: Boolean, default: false }
}, { _id: false });

// Here is the main User Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: [true, "Email must be unique"],
        minLength: [5, "Email must have atleast 5 characters"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: [true, "Phone number must be unique"],
    },
    password: {
        type: String,
        required: [true, "Password must be provided"],
        trim: true,
        select: false, // Corrected from Selection
    },
    role: {
        type: String,
        enum: ["client", "partner", "delivery_agent", "admin"],
        default: "client"
    },
    status: {
        type: String,
        enum: ["active", "suspended"],
        default: "active"
    },
    address: {
        type: String,
        default: 'Awae Escalier, Yaounde'
    },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
    verified: {
        type: Boolean, // Corrected type
        default: false
    },
    verificationCode: {
        type: String,
        select: false
    },
    verificationCodeValidation: {
        type: String,
        select: false
    },
    forgotPasswordCode: {
        type: String,
    },
    forgotPasswordExpiry:{
        type: Date,
        select: false
    },
    forgotPasswordCodeValidation: {
        type: Boolean,
        select: false,
        default: false
    },
      // hashed reset token approach (optional)
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false }

}, {
    timestamps: true // A better way to get createdAt and updatedAt
});

// ------------------- Mongoose Hooks & Methods -------------------
// Hash the password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
userSchema.methods.matchPassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

// createPasswordResetToken (kept for future use)
// Note: You need to import 'crypto' to use this.
// const crypto = require('crypto');
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    return resetToken;
};


// Indexes
userSchema.index({ location: '2dsphere' }); // for geo queries
userSchema.index({ email: 1 }); // for faster lookups
userSchema.index({ phone: 1 }); // for faster lookups
userSchema.index({ role: 1 }); // for role-based queries

module.exports = mongoose.model("User", userSchema);