const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optMiddleware = require('~v1/middleware/otpMiddleware');

// OTP schema definition
const otpSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            index: true,
            unique: true,
        },
        otp: {
            type: String,
            required: true,
            // validate: {
            //     validator: function (v) {
            //         return /^\d{6}$/.test(v);
            //     },
            //     message: (props) =>
            //         `${props.value} is not a valid OTP! It should be a 6-digit number.`,
            // },
        },
        createdAt: {
            type: Date,
            default: Date.now,
            immutable: true,
            expires: '5m',
        },
    },
    {
        timestamps: true,
    },
);

// Pre-save middleware for OTP
otpSchema.pre('save', optMiddleware);

// Create OTP model
module.exports = mongoose.model('OTP', otpSchema);
