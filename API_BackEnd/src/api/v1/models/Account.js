const mongoose = require('mongoose');
const { comparePassword } = require('~v1/middleware/userMiddleware');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 6,
        max: 255,
    },
    email: {
        type: String,
        min: 6,
        max: 255,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },

    password: {
        type: String,
        min: 8,
        max: 124,
    },

    phone: {
        type: String,
        min: 10,
        max: 10,
    },

    addresses: [
        {
            street: String,
            city: String,
            district: String,
            postalCode: String,
        },
    ],
    points: { type: Number, default: 0 },

    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    resetToken: { type: String, default: null }, // Optional default
    resetTokenExpiry: { type: Date, default: null }, // Optional default
    createAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.methods.comparePassword = comparePassword;

module.exports = mongoose.model('Account', userSchema);
