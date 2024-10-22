const mongoose = require('mongoose');
const {
    hashPassword,
    comparePassword,
} = require('~v1/middleware/userMiddleware');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    email: {
        type: String,
        required: true,
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
        required: true,
        min: 8,
        max: 124,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
});

// // Middleware
// userSchema.pre('save', hashPassword);

userSchema.methods.comparePassword = comparePassword;

module.exports = mongoose.model('Account', userSchema);
