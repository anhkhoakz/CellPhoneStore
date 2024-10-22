const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optMiddleware = require('~v1/middleware/otpMiddleware');

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
    },

    otp: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: '5m',
    },
});

otpSchema.pre('save', optMiddleware);

module.exports = mongoose.model('OTP', otpSchema);
