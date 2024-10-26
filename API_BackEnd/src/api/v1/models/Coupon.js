const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    discount: Number,
    expirationDate: Date,
    isUsed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Coupon', couponSchema);
