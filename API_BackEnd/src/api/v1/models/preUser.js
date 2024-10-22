const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preUserMiddleware = require('~v1/middleware/preUserMiddleware');

const preUserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },

    otp: {
        type: String,
    },

    username: {
        type: String,
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d',
    },
});

preUserSchema.pre('save', preUserMiddleware);

module.exports = mongoose.model('preUser', preUserSchema);
